export const useBlockLoadingStore = defineStore("BlockLoading", () => {
  const active = ref(false);

  function open() {
    active.value = true;
  }
  function close() {
    active.value = false;
  }

  return {
    active,
    open,
    close,
  };
});
