import { unref } from 'vue'
import { defineStore } from 'pinia'
import { usePermissionStore, useTagStore, useUserStore } from '@/store'
import { resetRouter, router } from '@/router'

export const useAuthStore = defineStore('auth', {
  persist: {
    key: 'gvb_admin_auth',
  },
  state: () => ({
    accessToken: null,
  }),
  actions: {
    setToken(token) {
      this.accessToken = token
    },
    toLogin() {
      const currentRoute = unref(router.currentRoute)
      router.replace({
        path: '/login',
        query: currentRoute.query,
      })
    },
    resetLoginState() {
      useUserStore().$reset()
      usePermissionStore().$reset()
      useTagStore().$reset()
      resetRouter()
      this.$reset()
    },
    /**
     * 主动退出登录
     */
    async logout() {
      // await api.logout()
      this.resetLoginState()
      this.toLogin()
      window.$message.success('您已经退出登录！')
    },
    /**
     * 被强制退出
     */
    async forceOffline() {
      this.resetLoginState()
      this.toLogin()
      window.$message.error('您已经被强制下线！')
    },
  },
})

// function toLoginWithQuery() {
//   const currentRoute = unref(router.currentRoute)
//  // 跳转回去时记录 redirect 到 query 上
//   const needRedirect = !currentRoute.meta.requireAuth && !['/404', '/login'].includes(currentRoute.path)
//   router.replace({
//     path: '/login',
//     query: needRedirect ? { ...currentRoute.query, redirect: currentRoute.path } : {},
//   })
// }
