import bcrypt from 'bcryptjs';
import { AppDataSource } from './data-source';
import { User } from '../entities/User';
import { Product } from '../entities/Product';
import { SiteSetting } from '../entities/SiteSetting';

const defaultSettings = [
    // ─── Hero Section ───
    { key: 'hero_badge', value: 'Est. 1988 · Boudha, Kathmandu', section: 'hero', label: 'Top Badge Text', type: 'text' },
    { key: 'hero_title_line1', value: 'Divine', section: 'hero', label: 'Title Line 1', type: 'text' },
    { key: 'hero_title_line2', value: 'Statues', section: 'hero', label: 'Title Line 2 (Gold)', type: 'text' },
    { key: 'hero_title_line3', value: 'of Nepal', section: 'hero', label: 'Title Line 3', type: 'text' },
    { key: 'hero_subtitle', value: 'Elite hand-carved statues and ritual art created by master artisans in the ancient tradition of Himalayan craftsmanship.', section: 'hero', label: 'Subtitle', type: 'textarea' },
    { key: 'hero_btn_primary', value: 'Browse Gallery', section: 'hero', label: 'Primary Button Text', type: 'text' },
    { key: 'hero_btn_secondary', value: 'Custom Order', section: 'hero', label: 'Secondary Button Text', type: 'text' },
    { key: 'hero_stat1_value', value: '35+', section: 'hero', label: 'Stat 1 Value', type: 'text' },
    { key: 'hero_stat1_label', value: 'Years of Mastery', section: 'hero', label: 'Stat 1 Label', type: 'text' },
    { key: 'hero_stat2_value', value: '3,200+', section: 'hero', label: 'Stat 2 Value', type: 'text' },
    { key: 'hero_stat2_label', value: 'Statues Delivered', section: 'hero', label: 'Stat 2 Label', type: 'text' },
    { key: 'hero_stat3_value', value: '12', section: 'hero', label: 'Stat 3 Value', type: 'text' },
    { key: 'hero_stat3_label', value: 'Master Artisans', section: 'hero', label: 'Stat 3 Label', type: 'text' },
    { key: 'hero_stat4_value', value: '40+', section: 'hero', label: 'Stat 4 Value', type: 'text' },
    { key: 'hero_stat4_label', value: 'Countries Shipped', section: 'hero', label: 'Stat 4 Label', type: 'text' },

    // ─── Hero Images ───
    { key: 'hero_img_1', value: 'https://images.unsplash.com/photo-1616423641454-e6992925345b?q=80&w=700', section: 'hero', label: 'Hero Image 1 (Top Left)', type: 'image' },
    { key: 'hero_img_2', value: 'https://images.unsplash.com/photo-1590650213165-c1fef80648c4?q=80&w=700', section: 'hero', label: 'Hero Image 2 (Bottom Left)', type: 'image' },
    { key: 'hero_img_3', value: 'https://images.unsplash.com/photo-1544111301-44754a01948d?q=80&w=700', section: 'hero', label: 'Hero Image 3 (Top Right)', type: 'image' },
    { key: 'hero_img_4', value: 'https://images.unsplash.com/photo-1533633517164-9da96eb5bb09?q=80&w=700', section: 'hero', label: 'Hero Image 4 (Bottom Right)', type: 'image' },

    // ─── Features Strip (Home) ───
    { key: 'features_icon1', value: 'Materials', section: 'home', label: 'Feature 1 Label', type: 'text' },
    { key: 'features_title1', value: 'Sacred Materials', section: 'home', label: 'Feature 1 Title', type: 'text' },
    { key: 'features_desc1', value: 'Pure copper, brass, and genuine 24K gold leaf sourced from certified suppliers.', section: 'home', label: 'Feature 1 Description', type: 'textarea' },
    { key: 'features_icon2', value: 'Craft', section: 'home', label: 'Feature 2 Label', type: 'text' },
    { key: 'features_title2', value: '100% Hand-Crafted', section: 'home', label: 'Feature 2 Title', type: 'text' },
    { key: 'features_desc2', value: 'Every statue is shaped by hand using centuries-old Nepalese techniques.', section: 'home', label: 'Feature 2 Description', type: 'textarea' },
    { key: 'features_icon3', value: 'Shipping', section: 'home', label: 'Feature 3 Label', type: 'text' },
    { key: 'features_title3', value: 'Worldwide Shipping', section: 'home', label: 'Feature 3 Title', type: 'text' },
    { key: 'features_desc3', value: 'Carefully packed and securely shipped to over 40 countries worldwide.', section: 'home', label: 'Feature 3 Description', type: 'textarea' },

    // ─── About Section ───
    { key: 'philosophy_badge', value: 'About Us', section: 'home', label: 'Home Page Badge', type: 'text' },
    { key: 'philosophy_title_line1', value: 'Where Faith', section: 'home', label: 'Philosophy Title Line 1', type: 'text' },
    { key: 'philosophy_title_line2', value: 'Meets', section: 'home', label: 'Philosophy Title Line 2', type: 'text' },
    { key: 'philosophy_title_line3', value: 'the Chisel', section: 'home', label: 'Philosophy Title Line 3', type: 'text' },
    { key: 'philosophy_desc', value: 'In the sacred air of Boudha, our artisans don\'t just carve metal—they transmit devotion into physical form. Every statue begins with a day of meditation.', section: 'home', label: 'Philosophy Description', type: 'textarea' },
    { key: 'cta_badge', value: 'Commission a Masterpiece', section: 'home', label: 'CTA Badge', type: 'text' },
    { key: 'cta_title_line1', value: 'Bring a God', section: 'home', label: 'CTA Title Line 1', type: 'text' },
    { key: 'cta_title_line2', value: 'Into Your Home', section: 'home', label: 'CTA Title Line 2', type: 'text' },
    { key: 'cta_desc', value: 'Each statue is a one-of-a-kind creation. Commission a bespoke piece crafted to your exact spiritual vision.', section: 'home', label: 'CTA Description', type: 'textarea' },
    { key: 'about_hero_badge', value: 'Our Essence', section: 'about', label: 'Page Badge Text', type: 'text' },
    { key: 'about_hero_title', value: 'The Soul of the Chisel', section: 'about', label: 'Hero Title', type: 'text' },
    { key: 'about_hero_quote', value: 'We don\'t create statues; we uncover the divinity already present within the metal.', section: 'about', label: 'Hero Quote', type: 'textarea' },
    { key: 'about_hero_img', value: 'https://images.unsplash.com/photo-1590650213165-c1fef80648c4?q=80&w=1000', section: 'about', label: 'Hero Story Image', type: 'image' },
    { key: 'about_story_title', value: 'A Legacy Carved in Tradition', section: 'about', label: 'Story Section Title', type: 'text' },
    { key: 'about_story_para1', value: 'Born in the sacred atmosphere of Boudha Stupa, KIRAN HANDICRAFT ENTERPRISES was founded in 1988 by Kiran Kumar Shakya.', section: 'about', label: 'Story Paragraph 1', type: 'textarea' },
    { key: 'about_story_para2', value: 'Our workshop is a place of silence and focus. As leading wholesalers and manufacturers, every piece we produce is the result of hundreds of hours of manual labor.', section: 'about', label: 'Story Paragraph 2', type: 'textarea' },

    // ─── Contact/General ───
    { key: 'contact_title', value: 'Inquiries & Commissions', section: 'contact', label: 'Page Title', type: 'text' },
    { key: 'contact_subtitle', value: 'Whether you are a collector, a practitioner, or an interior visionary, we invite you to connect with us for bespoke artistic journeys.', section: 'contact', label: 'Page Subtitle', type: 'textarea' },
    { key: 'contact_address', value: 'Boudha-6, Stupa, Kathmandu, Nepal', section: 'contact', label: 'Address', type: 'text' },
    { key: 'contact_phone', value: '01-4916351', section: 'contact', label: 'Phone Number', type: 'text' },
    { key: 'contact_email', value: 'kijenshakya@gmail.com', section: 'contact', label: 'Email Address', type: 'text' },
    { key: 'contact_whatsapp', value: '9779849532402', section: 'contact', label: 'WhatsApp Number', type: 'text' },
    { key: 'contact_facebook', value: 'https://facebook.com/kiranhandicraft', section: 'contact', label: 'Facebook URL', type: 'text' },
    { key: 'contact_instagram', value: 'https://instagram.com/kiranhandicraft', section: 'contact', label: 'Instagram URL', type: 'text' },

    // ─── General / SEO ───
    { key: 'general_site_name', value: 'KIRAN HANDICRAFT ENTERPRISES', section: 'general', label: 'Site Name', type: 'text' },
    { key: 'general_tagline', value: 'Wholesaler, Retailer & Manufacturer of Metalcrafts', section: 'general', label: 'Tagline', type: 'text' },

    // ─── Currency Exchange Rates (Base: NPR) ───
    { key: 'currency_usd_rate', value: '133.50', section: 'currency', label: 'USD Exchange Rate (1 USD = X NPR)', type: 'text' },
    { key: 'currency_eur_rate', value: '144.20', section: 'currency', label: 'EUR Exchange Rate (1 EUR = X NPR)', type: 'text' },
    { key: 'currency_aud_rate', value: '88.50', section: 'currency', label: 'AUD Exchange Rate (1 AUD = X NPR)', type: 'text' },
    { key: 'currency_gbp_rate', value: '168.10', section: 'currency', label: 'GBP Exchange Rate (1 GBP = X NPR)', type: 'text' },
];

const seed = async () => {
    try {
        await AppDataSource.initialize();
        console.log('✅ Database connected for seeding');

        const userRepo = AppDataSource.getRepository(User);
        const settingsRepo = AppDataSource.getRepository(SiteSetting);

        // 1. Admin User (Force reset/create)
        let admin = await userRepo.findOne({ where: { username: 'admin' } });
        const hashedPassword = await bcrypt.hash('admin123', 10);
        if (!admin) {
            admin = userRepo.create({ username: 'admin', email: 'admin@kiranhadicraft.com', password: hashedPassword });
            await userRepo.save(admin);
            console.log('✅ Admin user created (username: admin, password: admin123)');
        } else {
            admin.password = hashedPassword;
            await userRepo.save(admin);
            console.log('✅ Admin password reset to default: admin123');
        }

        // 2. Site Settings (Force update)
        for (const setting of defaultSettings) {
            const existing = await settingsRepo.findOne({ where: { key: setting.key } });
            if (existing) {
                existing.value = setting.value;
                existing.type = setting.type;
                existing.label = setting.label;
                existing.section = setting.section;
                await settingsRepo.save(existing);
            } else {
                await settingsRepo.save(settingsRepo.create(setting));
            }
        }
        console.log('✅ Site settings updated (Emojis removed)');

        // 3. Clean up existing watermarked image URLs from the database
        console.log('🔄 Cleaning up watermarked image URLs (restoring originals) in the database...');
        await AppDataSource.query(`
            UPDATE products 
            SET images = REPLACE(images, 'l_text:Arial_22_bold:Copyright%20Kiran%20Handicrafts%2Cco_white%2Cb_rgb:00000080/fl_layer_apply%2Cg_south_east%2Cx_15%2Cy_15/', '')
            WHERE images LIKE '%Copyright%';
        `);
        await AppDataSource.query(`
            UPDATE products 
            SET images = REPLACE(images, 'l_text:Arial_22_bold:Copyright%20Kiran%20Handicrafts,co_white,b_rgb:00000080/fl_layer_apply,g_south_east,x_15,y_15/', '')
            WHERE images LIKE '%Copyright%';
        `);
        console.log('✅ Watermarked image URLs restored to clean versions');

        await AppDataSource.destroy();
        console.log('✅ Seeding completed');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seed();
