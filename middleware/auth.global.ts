export default defineNuxtRouteMiddleware((to) => {
  if (["/login", "/register"].includes(to.path)) {
    if (useAuthStore().isLoggedIn) {
      return navigateTo("/dashboard");
    }
  } else if (!useAuthStore().isLoggedIn) {
    return navigateTo("/login");
  }
});
