import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use(Toast, {
        position: "top-right",
        timeout: 3500,
        maxToasts: 5,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: false,
        draggablePercent: 1,
        showCloseButtonOnHover: true,
        hideProgressBar: false,
        closeButton: "button",
        icon: true,
        rtl: false,
        filterBeforeCreate: (toast: any, toasts: any) => {
            if (toasts.filter(
                t => t.type === toast.type
            ).length !== 0) {
                // Returning false discards the toast
                return false;
            }
            // You can modify the toast if you want
            return toast;
        }
    });
});