import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// Variable to track if the menu was clicked
let isMenuNavigation = false;

// Function to call from your App.vue
export const allowNavigation = () => {
  isMenuNavigation = true;
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/schedule', name: 'schedule', component: () => import('../views/ScheduleView.vue') },
    { path: '/gallery', name: 'gallery', component: () => import('../views/GalleryView.vue') },
    { path: '/guidelines', name: 'guidelines', component: () => import('../views/GuidelinesView.vue') },
    { path: '/aftercare', name: 'aftercare', component: () => import('../views/AftercareView.vue') },
    { path: '/admin/7K9x2M5pW1rB8vQz', name: 'admin', component: () => import('../views/AdminView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to, from, next) => {
  // 1. Always allow the Admin route
  if (to.name === 'admin') {
    return next();
  }

  // 2. Allow navigation from Navigation Drawer
  if (isMenuNavigation) {
    isMenuNavigation = false;
    return next();
  }

  // 3. NEW: Allow navigation from Guidelines specifically to Gallery
  // This enables the "Jewellery designs gallery" link to work
  if (from.name === 'guidelines' && to.name === 'gallery') {
    return next();
  }

  // 4. Special case: Root/Reload access
  if (to.name === 'home' && (from.name === undefined || from.name === null)) {
    return next();
  }

  // 5. BLOCK EVERYTHING ELSE
  next(false);
});

export default router
