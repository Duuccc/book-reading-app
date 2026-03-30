export const generateSlug = (text: string): string => {
    return text
        .toLowerCase()
        .normalize('NFD')                        // Tách dấu tiếng Việt
        .replace(/[\u0300-\u036f]/g, '')         // Xóa dấu
        .replace(/đ/g, 'd').replace(/Đ/g, 'd')  // Xử lý chữ đ
        .replace(/[^a-z0-9\s-]/g, '')           // Xóa ký tự đặc biệt
        .trim()
        .replace(/\s+/g, '-')                   // Khoảng trắng → dấu gạch
        .replace(/-+/g, '-');                   // Nhiều gạch → 1 gạch
};

export const generateUniqueSlug = async (
    text: string,
    checkExists: (slug: string) => Promise<boolean>
): Promise<string> => {
    const baseSlug = generateSlug(text)
    let slug = baseSlug
    let exists = await checkExists(slug)

    if(exists) {
        slug = `${baseSlug}-${Date.now()}`
    }

    return slug
}

