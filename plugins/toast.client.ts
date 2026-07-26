// plugins/toast.client.ts
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { useToast } from "vue-toastification";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Toast, {
        position: "top-right",
        timeout: 3000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        showCloseButtonOnHover: false,
        hideProgressBar: false,
        closeButton: "button",
        icon: true,
        rtl: false,
        maxToasts: 5,
        newestOnTop: true,
    });

    return {
        provide: {
            toast: useToast(),
        },
    };
});