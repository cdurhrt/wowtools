<script setup lang="ts">
import {
  NTabPane,
  NTabs,
  NOl,
  NLi,
  NTag,
  NH3,
  NButton,
  NIcon,
  NEmpty,
  NSpace,
  NSpin,
} from "naive-ui";
import { computed, onBeforeMount, reactive, ref } from "vue";
import { extFetch } from "../../utils/crt-utils";
import type { NewsBillboard, NewsBillboardSetting, NewsLink } from "./news";
import { onDragStart, onDragEnter, onDragEnd, onDragOver } from "./drag";
import { Add24Regular } from "@vicons/fluent";

const { VITE_BASE_URL, MODE } = import.meta.env;

const vm_tab = ref("设置");
const spinning = ref(false);
const newsList = reactive<NewsBillboard[]>([]);
const settings = reactive<NewsBillboardSetting[]>([]);
const settingsEnabled = reactive<NewsBillboardSetting[]>([]);
const settingsDisabled = computed<NewsBillboardSetting[]>(() => {
  return settings.filter((f) => f.disabled);
});

// 整个覆盖reactive数组的值
function ArrayCover<T>(target: T[], value: T[]): void {
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

// 手动更新SettingEnabled的值
function updateSettingEnabled(
  list: NewsBillboardSetting[] = getSettingsEnabled()
) {
  ArrayCover<NewsBillboardSetting>(settingsEnabled, list);
}

// 返回settings中所有已启用的
function getSettingsEnabled(): NewsBillboardSetting[] {
  return settings.filter((f) => !f.disabled);
}

// 设置所有的项启停
function setAllDisabled(value: boolean) {
  settings.forEach((f) => (f.disabled = value));
  updateSettingEnabled();
}

// 启用某一个项启停
function setOneEnabled(item: NewsBillboardSetting, value = true) {
  settings.find((f) => f.id === item?.id)!.disabled = !value;
  updateSettingEnabled();
}

// 缓存 news-settings
function saveSettings() {
  try {
    localStorage.setItem("news-settings", JSON.stringify(settingsEnabled));
  } catch (error) {
    console.error(error);
  }
}

function getCacheSettings(): NewsBillboardSetting[] {
  try {
    return JSON.parse(localStorage.getItem("news-settings") || "");
  } catch (error) {
    console.error(error);
    return [];
  }
}

function setListForIt(list: NewsBillboard[]) {
  return (res: string) => {
    ArrayCover(list, getListFromDOMText(res));
    const cacheSettings = getCacheSettings();
    ArrayCover(
      settings,
      list.map((m, idx) => {
        const { id, name, type, refreshAt } = m;
        const cachedIt = cacheSettings.find((f) => f.id === id)!;
        return {
          id,
          name,
          type,
          refreshAt,
          disabled: !cachedIt,
          sort: cachedIt?.sort || 0,
        };
      })
    );
    updateSettingEnabled();
  };
}

// 请求
function DOMTextRequest() {
  spinning.value = true;
  if (MODE === "production") {
    extFetch(VITE_BASE_URL + "/tophub", "text")
      .then(setListForIt(newsList))
      .finally(() => (spinning.value = false));
  } else {
    fetch(VITE_BASE_URL + "/tophub")
      .then((res) => res.text())
      .then(setListForIt(newsList))
      .finally(() => (spinning.value = false));
  }
}

onBeforeMount(() => {
  const cacheDOMText = localStorage.getItem("DOM") || "";
  setListForIt(newsList)(cacheDOMText);
  DOMTextRequest();
});
</script>

<template>
  <n-tabs v-model:value="vm_tab" type="card" animated>
    <n-tab-pane name="设置" tab="设置">
      <n-spin :show="spinning">
        <div class="settings-wrapper" @dragover="onDragOver">
          <n-h3 prefix="bar" align-text>已启用的标签：</n-h3>
          <div>
            <n-button
              v-if="settingsEnabled.length"
              @click="setAllDisabled(true)"
            >
              停用所有
            </n-button>
            <n-empty v-else description="空"> </n-empty>
          </div>
          <transition-group name="sort" appear tag="div">
            <n-tag
              v-for="(item, idx) in settingsEnabled"
              :key="item.id"
              type="success"
              closable
              @close="setOneEnabled(item, false)"
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
        <div class="settings-wrapper">
          <n-h3 prefix="bar" align-text>未启用的标签：</n-h3>
          <div>
            <n-button
              v-if="settingsDisabled.length"
              @click="setAllDisabled(false)"
            >
              启用所有
            </n-button>
            <n-empty v-else description="空"> </n-empty>
          </div>
          <transition-group name="take-up" appear tag="div">
            <n-button
              v-for="item in settingsDisabled"
              :key="item.id"
              ghost
              size="small"
              icon-placement="right"
              @click="setOneEnabled(item)"
            >
              {{ item.name + item.type }}
              <template #icon>
                <n-icon>
                  <Add24Regular />
                </n-icon>
              </template>
            </n-button>
          </transition-group>
        </div>
        <div class="settings-wrapper">
          <n-space>
            <n-button type="primary" @click="saveSettings">保存</n-button>
          </n-space>
        </div>
      </n-spin>
    </n-tab-pane>
    <template v-for="bang in newsList" :key="bang.id">
      <n-tab-pane :name="bang.name + bang.type" :tab="bang.name + bang.type">
        <n-spin :show="spinning">
          <n-ol>
            <n-li v-for="link in bang.linksList" :key="bang.id + '-' + link.id">
              <a :href="link.href" target="_blank">{{ link.title }}</a>
              {{ link.oinfo }}
            </n-li>
          </n-ol>
        </n-spin>
      </n-tab-pane>
    </template>
  </n-tabs>
</template>

<style scoped>
.sort-move {
  transition: transform 0.3s;
}
.sort-enter-active,
.sort-leave-active {
  transition: all 0.3s ease;
}
.sort-enter-from,
.sort-leave-to {
  opacity: 0;
  /* transform: translateY(100px); */
}
.take-up-enter-active,
.take-up-leave-active {
  transition: all 0.3s ease;
}
.take-up-enter-from,
.take-up-leave-to {
  opacity: 0;
  /* transform: translateY(-100px); */
}
.settings-wrapper {
  padding: 0 54px;
  margin: 32px 0;
}
.n-tag,
.n-button {
  margin: 4px;
}
</style>
