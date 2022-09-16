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
  useMessage,
} from "naive-ui";
import { computed, onBeforeMount, reactive, ref } from "vue";
import { extFetch } from "../../utils/crt-utils";
import type { NewsBillboard, NewsBillboardTag, NewsLink } from "./news";
import { onDragStart, onDragEnter, onDragEnd, onDragOver } from "./drag";
import { Add24Regular } from "@vicons/fluent";
import { differenceBy } from "lodash";

const { VITE_BASE_URL, MODE } = import.meta.env;

const vm_tab = ref("设置");
const spinning = ref(false);
const message = useMessage();

// 解析获得tabs
const newsTabsList = reactive<NewsBillboard[]>([]);
const tabs = computed<NewsBillboardTag[]>(() => {
  return differenceBy(tags.value, tagsEnabled, "id");
});

// 所有的配置Tag
const tags = computed<NewsBillboardTag[]>(() =>
  newsTabsList.map((m, idx) => ({
    id: m.id,
    name: m.name,
    type: m.type,
    disabled: false,
    sort: idx + 1,
  }))
);
// 启用的Tag
const tagsEnabled = reactive<NewsBillboardTag[]>([]);
// 禁用的Tag
const tagsDisabled = computed<NewsBillboardTag[]>(() => {
  return differenceBy(tags.value, tagsEnabled, "id");
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

// 手动更新 TagEnabled 的值
function updateTagEnabled(list: NewsBillboardTag[] = getCacheTagsEnabled()) {
  ArrayCover<NewsBillboardTag>(tagsEnabled, list);
}

// 停用所有Tag
function setAllTagsDisabled() {
  updateTagEnabled([]);
}

// 启用所有Tag
function setAllTagsEnabled() {
  updateTagEnabled([...tagsEnabled, ...tagsDisabled.value]);
}

// 停用某一个Tag
function setTagDisabled(index: number) {
  tagsEnabled.splice(index, 1);
}

// 启用某一个Tag
function setTagEnabled(item: NewsBillboardTag) {
  tagsEnabled.push(item);
}

// 缓存 NEWS-TAGS-ENABLED
function setCacheTagsEnabled() {
  try {
    localStorage.setItem("NEWS-TAGS-ENABLED", JSON.stringify(tagsEnabled));
    message.success("保存成功");
  } catch (error) {
    console.error(error);
  }
}

// 获取缓存 NEWS-TAGS-ENABLED
function getCacheTagsEnabled(): NewsBillboardTag[] {
  try {
    return JSON.parse(localStorage.getItem("NEWS-TAGS-ENABLED") || "[]");
  } catch (error) {
    console.error(error);
    return [];
  }
}

function setListForIt(list: NewsBillboard[]) {
  return (res: string) => {
    ArrayCover(list, getListFromDOMText(res));
    updateTagEnabled();
  };
}

// 请求
function DOMTextRequest() {
  spinning.value = true;
  if (MODE === "production") {
    extFetch(VITE_BASE_URL + "/tophub", "text")
      .then(setListForIt(newsTabsList))
      .finally(() => (spinning.value = false));
  } else {
    fetch(VITE_BASE_URL + "/tophub")
      .then((res) => res.text())
      .then(setListForIt(newsTabsList))
      .finally(() => (spinning.value = false));
  }
}

onBeforeMount(() => {
  const cacheDOMText = localStorage.getItem("DOM") || "";
  setListForIt(newsTabsList)(cacheDOMText);
  DOMTextRequest();
});
</script>

<template>
  <n-tabs v-model:value="vm_tab" type="card" animated>
    <n-tab-pane name="设置" tab="设置">
      <n-spin :show="spinning">
        <div class="tags-wrapper" @dragover="onDragOver">
          <n-h3 prefix="bar" align-text>已启用的Tag：</n-h3>
          <div>
            <n-button v-if="tagsEnabled.length" @click="setAllTagsDisabled()">
              停用所有
            </n-button>
            <n-empty v-else description="空"> </n-empty>
          </div>
          <transition-group name="sort" appear tag="div">
            <n-tag
              v-for="(item, idx) in tagsEnabled"
              :key="item.id"
              type="success"
              closable
              @close="setTagDisabled(idx)"
              :draggable="true"
              @dragstart="onDragStart(item)"
              @dragenter="onDragEnter(item, $event)"
              @dragend="onDragEnd(tagsEnabled)"
              @dragover="onDragOver($event)"
            >
              {{ idx + 1 }}：{{ item.name + item.type }}
            </n-tag>
          </transition-group>
        </div>
        <div class="tags-wrapper">
          <n-h3 prefix="bar" align-text>未启用的Tag：</n-h3>
          <div>
            <n-button v-if="tagsDisabled.length" @click="setAllTagsEnabled()">
              启用所有
            </n-button>
            <n-empty v-else description="空"> </n-empty>
          </div>
          <transition-group name="take-up" appear tag="div">
            <n-button
              v-for="item in tagsDisabled"
              :key="item.id"
              ghost
              size="small"
              icon-placement="right"
              @click="setTagEnabled(item)"
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
        <div class="tags-wrapper">
          <n-space>
            <n-button type="primary" @click="setCacheTagsEnabled"
              >保存</n-button
            >
          </n-space>
        </div>
      </n-spin>
    </n-tab-pane>
    <template v-for="bang in newsTabsList" :key="bang.id">
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
.tags-wrapper {
  padding: 0 54px;
  margin: 32px 0;
}
.n-tag,
.n-button {
  margin: 4px;
}
</style>
