import { MenuItemTypes } from "../constants/menu";
import { axiosInstance } from "./api/apiCore";

const getMenuItems = async (): Promise<MenuItemTypes[]> => {
  try {
    const userSession = sessionStorage.getItem("prometeo_user");
    if (!userSession) {
      console.error("No user session found");
      return [];
    }

    const { user: { id:userId } } = JSON.parse(userSession);
    // Fetch permissions from the backend
    const response = await axiosInstance.get(`/api/users/${userId}/permissions`);
    const permissions = response.data.permissions;

    // Map permissions to menu items and filter out excluded modules
    const excludedModules = ['modules', 'profiles', 'permissions', 'cg_breakdown', 'users']
    const menuItems: MenuItemTypes[] = permissions.reduce((acc: MenuItemTypes[], permission: any) => {
      if (!excludedModules.includes(permission.module_name)) {
        acc.push({
          key: permission.module_name,
          label: permission.module_name,
          children: [],
        });
      }
      return acc;
    }, []);

    return menuItems;
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return [];
  }
};

const findAllParent = (
  menuItems: MenuItemTypes[],
  menuItem: MenuItemTypes
): string[] => {
  let parents: string[] = [];
  const parent = findMenuItem(menuItems, menuItem.parentKey);

  if (parent) {
    parents.push(parent.key);
    if (parent.parentKey) {
      parents = [...parents, ...findAllParent(menuItems, parent)];
    }
  }
  return parents;
}

const findMenuItem = (
  menuItems: MenuItemTypes[] | undefined,
  menuItemKey: MenuItemTypes['key'] | undefined
): MenuItemTypes | null => {
  if (menuItems && menuItemKey) {
    for (let i = 0; i < menuItems.length; i++) {
      if (menuItems[i].key === menuItemKey) {
        return menuItems[i];
      }
      const found = findMenuItem(menuItems[i].children, menuItemKey);
      if (found) return found;
    }
  }
  return null;
}

export { getMenuItems, findAllParent, findMenuItem, };