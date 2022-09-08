<script setup lang="ts">
import { NTabPane, NTabs, NOl, NLi, NTag, NH3, NButton, NIcon } from "naive-ui";
import { computed, onBeforeMount, reactive, ref, type Ref } from "vue";
import { extFetch } from "../../utils/crt-utils";
import type { NewsBillboard, NewsBillboardSetting, NewsLink } from "./news";
import { onDragStart, onDragEnter, onDragEnd, onDragOver } from "./drag";
import { cloneDeep } from "lodash";
import { Add24Regular } from "@vicons/fluent";

const { VITE_BASE_URL, MODE } = import.meta.env;

const newsList = reactive<NewsBillboard[]>([]);
const settings = reactive<NewsBillboardSetting[]>([]);
const settingsEnabled = reactive<NewsBillboardSetting[]>([]);
const settingsDisabled = computed<NewsBillboardSetting[]>(() => {
  return settings.filter((f) => f.disabled);
});
const vm_tab = ref("设置");

// 整个覆盖reactive数组的值
function reactiveArrayCover<T>(target: T[], value: T[]): void {
  target.splice(0, target.length, ...value);
}

// 将获取的DOMText解析成 NewsBillboard 对象数组
function getListFromDOMText(res: string): NewsBillboard[] {
  if (!res) return [];
  localStorage.setItem("DOM", res);
  const DOMTextDOMContext = new DOMParser().parseFromString(res, "text/html");
  const nodexList = DOMTextDOMContext.querySelectorAll('[id^="node-"]');

  return Array.from(nodexList as ArrayLike<Element>).map(
    (nodex): NewsBillboard => {
      const linksList: NewsLink[] = Array.from(
        nodex.querySelectorAll(".nano-content a") as ArrayLike<Element>
      ).map((m): NewsLink => {
        return {
          id: m.getAttribute("itemid"),
          href: m.getAttribute("href"),
          rank: m.querySelector("span.s")?.textContent,
          title: m.querySelector("span.t")?.textContent,
          oinfo: m.querySelector("span.e")?.textContent,
        };
      });

      return {
        id: nodex.getAttribute("id"),
        name: nodex?.querySelector(".cc-cd-lb>span")?.textContent,
        type: nodex?.querySelector("span.cc-cd-sb-st")?.textContent,
        imgUrl: nodex?.querySelector(".cc-cd-lb>img")?.getAttribute("src"),
        refreshAt: nodex?.querySelector(".cc-cd-if>div.i-h")?.textContent,
        linksList: linksList,
      };
    }
  );
}

function setListForIt(list: NewsBillboard[]) {
  return (res: string) => {
    list.splice(0, list.length, ...getListFromDOMText(res));
    reactiveArrayCover(
      settings,
      list.map((m, idx) => {
        const { id, name, type, refreshAt } = m;
        return {
          id,
          name,
          type,
          refreshAt,
          disabled: false,
          sort: idx + 1,
        };
      })
    );
    updateSettingEnabled(getSettingsEnabled());
  };
}

// 手动更新SettingEnabled的值
function updateSettingEnabled(list: NewsBillboardSetting[]) {
  reactiveArrayCover<NewsBillboardSetting>(settingsEnabled, list);
}

// 当删除一个已启用时
function handleNTagClose(item: NewsBillboardSetting) {
  settings.find((f) => f.id === item.id)!.disabled = true;
  updateSettingEnabled(getSettingsEnabled());
}

// 返回settings中所有已启用的
function getSettingsEnabled(): NewsBillboardSetting[] {
  return settings.filter((f) => !f.disabled);
}

// 启用某一个时
function setTabEnabled(item: NewsBillboardSetting) {
  settings.find((f) => f.id === item.id)!.disabled = false;
  updateSettingEnabled(getSettingsEnabled());
}

// 请求
function DOMTextRequest() {
  if (MODE === "production") {
    extFetch(VITE_BASE_URL + "/tophub", "text").then(setListForIt(newsList));
  } else {
    fetch(VITE_BASE_URL + "/tophub")
      .then((res) => res.text())
      .then(setListForIt(newsList));
  }
}

onBeforeMount(() => {
  const cacheDOMText = localStorage.getItem("DOM") || "";
  setListForIt(newsList)(cacheDOMText);
  // DOMTextRequest();
  console.log("MODE :>> ", MODE);
});
</script>

<template>
  <n-tabs v-model:value="vm_tab" type="card" animated>
    <n-tab-pane name="设置" tab="设置">
      <div class="setting-valid-tags" @dragover="onDragOver">
        <n-h3 prefix="bar" align-text>已启用的Tab：</n-h3>
        <transition-group name="sort" tag="div">
          <n-tag
            v-for="(item, idx) in settingsEnabled"
            :key="item.id"
            type="success"
            closable
            @close="handleNTagClose(item)"
            :draggable="true"
            @dragstart="onDragStart(item)"
            @dragenter="onDragEnter(item, $event)"
            @dragend="onDragEnd(settingsEnabled)"
            @dragover="onDragOver($event)"
          >
            {{ idx + 1 }}：{{ item.name + item.type }}
          </n-tag>
        </transition-group>
      </div>
      <div class="setting-valid-tags">
        <n-h3 prefix="bar" align-text>未启用的Tab：</n-h3>
        <div>
          <n-button
            v-for="item in settingsDisabled"
            :key="item.id"
            ghost
            size="small"
            icon-placement="right"
            @click="setTabEnabled(item)"
          >
            {{ item.name + item.type }}
            <template #icon>
              <n-icon>
                <Add24Regular />
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </n-tab-pane>
    <template v-for="bang in newsList" :key="bang.id">
      <n-tab-pane :name="bang.name + bang.type" :tab="bang.name + bang.type">
        <n-ol>
          <n-li v-for="link in bang.linksList" :key="bang.id + '-' + link.id">
            <a :href="link.href" target="_blank">{{ link.title }}</a>
            {{ link.oinfo }}
          </n-li>
        </n-ol>
      </n-tab-pane>
    </template>
  </n-tabs>
</template>

<style scoped>
.sort-move {
  transition: transform 0.3s;
}
.setting-valid-tags {
  padding: 0 54px;
  margin: 32px 0;
}
.n-tag,
.n-button {
  margin: 4px;
}
</style>
