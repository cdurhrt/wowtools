<script setup lang="ts">
import { NTabPane, NTabs, NSpace, NTag } from "naive-ui";
import { onBeforeMount, reactive, ref, type Ref } from "vue";
import { extFetch } from "../../utils/crt-utils";
import type { NewsBillboard, NewsLink } from "./news";
import { onDragStart, onDragEnter, onDragEnd, onDragOver } from "./drag";

const { VITE_BASE_URL, MODE } = import.meta.env;

const newsList = reactive<NewsBillboard[]>([]);
const vm_tab = ref("微博热搜榜");

const DOMTextRequest = () => {
  if (MODE === "production") {
    extFetch(VITE_BASE_URL + "/tophub", "text").then(setListForIt(newsList));
  } else {
    fetch(VITE_BASE_URL + "/tophub")
      .then((res) => res.text())
      .then(setListForIt(newsList));
  }
};

const getListFromDOMText = (res: string): NewsBillboard[] => {
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
};

const setListForIt = (list: NewsBillboard[]) => {
  return (res: string) => {
    list.splice(0, list.length, ...getListFromDOMText(res));
  };
};

const handleNTagClose = (event: Event) => {
  return;
};

onBeforeMount(() => {
  const cacheDOMText = localStorage.getItem("DOM") || "";
  setListForIt(newsList)(cacheDOMText);
  DOMTextRequest();
  console.log("MODE :>> ", MODE);
});
</script>

<template>
  <n-tabs v-model:value="vm_tab" type="card" animated>
    <n-tab-pane name="设置" tab="设置">
      <div>
        <n-space @dragover="onDragOver">
          <transition-group name="sort">
            <n-tag
              v-for="bang in newsList"
              :key="bang.id"
              type="info"
              closable
              @close="handleNTagClose"
              :draggable="true"
              @dragstart="onDragStart(bang)"
              @dragenter="onDragEnter(bang, $event)"
              @dragend="onDragEnd(newsList)"
              @dragover="onDragOver($event)"
            >
              {{ bang.name + bang.type }}
            </n-tag>
          </transition-group>
        </n-space>
      </div>
    </n-tab-pane>
    <template v-for="bang in newsList" :key="bang.id">
      <n-tab-pane :name="bang.name + bang.type" :tab="bang.name + bang.type">
        <ol>
          <li v-for="link in bang.linksList" :key="bang.id + '-' + link.id">
            <a :href="link.href" target="_blank">{{ link.title }}</a>
            {{ link.oinfo }}
          </li>
        </ol>
      </n-tab-pane>
    </template>
  </n-tabs>
</template>

<style scoped>
.sort-move {
  transition: transform 0.3s;
}
</style>
