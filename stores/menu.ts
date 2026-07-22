import { defineStore } from "pinia";
import { useCookie } from "#app";

export interface Menu {
    id: string;
    name: string;
    url: string;
    image?: string;
    addedAt: string;
    lastVisited: string;
}

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

    // Load from cookie
    if (menuCookie.value) {
        menus.value = menuCookie.value;
    }

    // Actions
    const addMenu = (url: string, image?: string) => {
        try {
            // Check if URL already exists
            const existingMenu = menus.value.find(m => m.url === url.trim());
            if (existingMenu) {
                // Update last visited instead of adding duplicate
                existingMenu.lastVisited = new Date().toISOString();
                return existingMenu;
            }

            const hostname = new URL(url).hostname.replace("www.", "");
            const baseName = hostname.split(".")[0];

            const newMenu: Menu = {
                id: Date.now().toString(36) + Math.random().toString(36).substr(2, 8),
                name: baseName.charAt(0).toUpperCase() + baseName.slice(1) , //+ " Menu"
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

    const addMultipleMenus = (urls: string[]) => {
        const added: Menu[] = [];
        urls.forEach(url => {
            const result = addMenu(url);
            if (result) added.push(result);
        });
        return added;
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
        addMultipleMenus,
        removeMenu,
        updateLastVisited,
        updateMenuImage,
    };
});