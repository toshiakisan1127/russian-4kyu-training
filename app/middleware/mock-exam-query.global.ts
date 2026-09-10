export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server || to.path !== '/mock') return

  const browserExamId = new URLSearchParams(window.location.search).get('exam')
  const routeExamId = Array.isArray(to.query.exam) ? to.query.exam[0] : to.query.exam

  if (!browserExamId || browserExamId === routeExamId) return

  return navigateTo({
    path: to.path,
    query: { ...to.query, exam: browserExamId },
  }, { replace: true })
})
