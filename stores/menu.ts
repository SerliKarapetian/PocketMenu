import { defineStore } from "pinia";
import { useCookie } from "#app";

export const useMenuStore = defineStore("menu", () => {
    const menus = ref<Menu[]>([]);

    // Persistent cookie
    const menuCookie = useCookie<Menu[]>("pocketmenu-menus", {
        default: () => [],
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });

    // Sync cookie with state
    watch(
        menus,
        (newValue) => {
            menuCookie.value = newValue;
        },
        { deep: true }
    );

    // Load from cookie (runs on both server & client)
    if (menuCookie.value) {
        menus.value = menuCookie.value;
    }

    // Actions
    const addMenu = (url: string, image?: string) => {
        try {
            const hostname = new URL(url).hostname.replace("www.", "");
            const baseName = hostname.split(".")[0];

            const newMenu: Menu = {
                id: Date.now().toString(36) + Math.random().toString(36).substr(2, 8),
                name: baseName.charAt(0).toUpperCase() + baseName.slice(1) + " Menu",
                url: url.trim(),
                image: image,
                addedAt: new Date().toISOString(),
                lastVisited: new Date().toISOString(),
            };

            menus.value.unshift(newMenu);
            return newMenu;
        } catch (e) {
            alert("Please enter a valid URL");
            return null;
        }
    };

    const removeMenu = (id: string) => {
        menus.value = menus.value.filter((m) => m.id !== id);
    };

    const updateLastVisited = (id: string) => {
        const menu = menus.value.find((m) => m.id === id);
        if (menu) menu.lastVisited = new Date().toISOString();
    };

    const updateMenuImage = (id: string, imageUrl: string) => {
        const menu = menus.value.find((m) => m.id === id);
        if (menu) menu.image = imageUrl;
    };

    return {
        menus,
        addMenu,
        removeMenu,
        updateLastVisited,
        updateMenuImage,
    };
});