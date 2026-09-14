import {
    login,
    logout,
    getAdminDashboard,
    getAdminUsers,
    deleteUser,
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    getAdminCategories,
    getOrders,
    getOrder,
    getAdminProfile,
    updateAdminEmail,
    updateAdminPassword,
    uploadProductImages,
    getBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    uploadBannerImage,
} from './api';

export const loginAdmin = async (email, password) => {
    const user = await login(email, password);
    if (user.role !== 'admin') throw new Error('Administrator access required.');
    return user;
};

export {
    logout,
    getAdminDashboard,
    getAdminUsers,
    deleteUser,
    getProducts,
    getProducts as getAdminProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    getAdminCategories,
    getOrders,
    getOrder,
    getAdminProfile,
    updateAdminEmail,
    updateAdminPassword,
    uploadProductImages,
    getBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    uploadBannerImage,
};
