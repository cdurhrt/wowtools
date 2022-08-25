<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { extFetch } from "../../utils/ext-utils";

const newsList = ref();

onBeforeMount(() => {
  const tophubDOMString = localStorage.getItem("tophubDOM") || "";
  parseTophubHtml(tophubDOMString);
  getTophubToday();
  // getzhihu();
});

const parseTophubHtml = (res: string) => {
  console.log("parseTophubHtml res :>> ", res);
  if (!res) return;
  localStorage.setItem("tophubDOM", res);
  const tophubDOM = new DOMParser().parseFromString(res, "text/html");
  console.log("tophubDOM :>> ", tophubDOM);

  const nodexList = tophubDOM.querySelectorAll('[id^="node-"]');
  // newsList.splice(0, newsList.length);
  newsList.value = Array.from(nodexList as ArrayLike<Element>).map((nodex) => {
    const linksList = Array.from(
      nodex.querySelectorAll(".nano-content a") as ArrayLike<Element>
    ).map((m) => {
      return {
        href: m.getAttribute("href"),
        itemid: m.getAttribute("itemid"),
        rank: m.querySelector("span.s")?.textContent,
        title: m.querySelector("span.t")?.textContent,
        heat: m.querySelector("span.e")?.textContent,
      };
    });
    console.log("nodex :>> ", nodex);
    return {
      id: nodex.getAttribute("id"),
      name: nodex?.querySelector(".cc-cd-lb>span")?.textContent,
      type: nodex?.querySelector("span.cc-cd-sb-st")?.textContent,
      imgUrl: nodex?.querySelector(".cc-cd-lb>img")?.getAttribute("src"),
      refreshAt: nodex?.querySelector(".cc-cd-if>div.i-h")?.textContent,
      linksList: linksList,
    };
  });
  // newsList.push(...list);
  console.log("newsList :>> ", newsList.value);
};

function getTophubToday() {
  // extFetch("/tophub")
  //   .then((res) => res.text())
  //   .then(parseTophubHtml);
  extFetch("https://tophub.today/").then((res) => {
    console.log("extFetch /tophub res :>> ", res);
  });
}

function getzhihu() {
  fetch("/zhihu").then((res) => {
    console.log("res :>> ", res);
  });
}
</script>

<template>
  <div class="news-board">
    <div v-for="bang in newsList" :key="bang.id">
      <h3>{{ bang.name }}{{ bang.type }}</h3>
      <ul class="news-list">
        <li v-for="link in bang.linksList" :key="bang.id + '-' + link.itemid">
          {{ link.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.news-board {
  display: flex;
  flex-wrap: wrap;
}
.news-list {
  /* width: 25%; */
  height: 50vh;
  overflow-y: scroll;
}
</style>
