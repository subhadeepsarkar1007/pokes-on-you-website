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
    { path: '/admin/12345aeiou', name: 'admin', component: () => import('../views/AdminView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to, from, next) => {
  // 1. Always allow the Admin route to be accessed directly
  if (to.name === 'admin') {
    return next();
  }

  // 2. Allow navigation if it's coming from the Navigation Drawer
  if (isMenuNavigation) {
    isMenuNavigation = false; // Reset for next check
    return next();
  }

  // 3. Special case: If the user is at the root and tries to reload or enter Home
  if (to.name === 'home' && from.name === undefined) {
    return next();
  }

  // 4. BLOCK EVERYTHING ELSE (Back button, Forward button, Manual URL entry)
  // next(false) keeps the user on the current page and resets the URL
  next(false);
});

export default router
