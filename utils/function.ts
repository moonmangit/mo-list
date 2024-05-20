export async function callWith(
  callback: Function,
  options?: {
    loading: boolean;
  },
) {
  const preparedCallback = async () => {
    try {
      if (options?.loading) {
        useBlockLoadingStore().open();
      }
      await callback();
      if (options?.loading) {
        useBlockLoadingStore().close();
      }
    } catch (error) {
      if (options?.loading) {
        useBlockLoadingStore().close();
      }
    }
  };
  await preparedCallback();
}
