<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";

const pagehtml = ref();

onBeforeMount(() => {
  const tophubDOMString = localStorage.getItem("tophubDOM") || "";
  parseTophubHtml(tophubDOMString);
  // getTophubToday();
});

const parseTophubHtml = (res: string) => {
  if (!res) return;
  localStorage.setItem("tophubDOM", res);
  const tophubDOM = new DOMParser().parseFromString(res, "text/html");
  console.log("tophubDOM :>> ", tophubDOM);
  pagehtml.value = tophubDOM.getElementById("page")?.outerHTML;
  console.log("page :>> ", pagehtml);
};

function getTophubToday() {
  fetch("/tophub")
    .then((res) => res.text())
    .then(parseTophubHtml);
}
</script>
<template>
  <div v-html="pagehtml"></div>
</template>
