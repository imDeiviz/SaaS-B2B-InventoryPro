import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/product.model.js';
import { Settings } from './models/settings.model.js';
import { Warehouse } from './models/warehouse.model.js';
import { Supplier } from './models/supplier.model.js';
import { Movement } from './models/movement.model.js';
import { User } from './models/user.model.js';
import connectDB from './config/db.js';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Product.deleteMany({});
        await Settings.deleteMany({});
        await Warehouse.deleteMany({});
        await Supplier.deleteMany({});
        await Movement.deleteMany({});
        await User.deleteMany({});

        console.log('🗑️  Existing data cleared');

        // 1. Seed Suppliers
        const suppliers = await Supplier.insertMany([
            {
                name: 'ElectroSupply Corp',
                email: 'ventas@electrosupply.com',
                phone: '+52 55 1234 5678',
                address: 'Polanco, CDMX',
                taxId: 'ESC850101XXX',
                isActive: true
            },
            {
                name: 'TechParts Internacional',
                email: 'orders@techparts.com',
                phone: '+52 81 9876 5432',
                address: 'San Pedro, MTY',
                taxId: 'TPI900215YYY',
                isActive: true
            }
        ]);
        console.log('🏢 Suppliers seeded');

        // 2. Seed Warehouses
        const warehouses = await Warehouse.insertMany([
            {
                name: 'Almacén Central CDMX',
                code: 'CDMX-001',
                address: 'Av. Insurgentes Sur 1234',
                city: 'Ciudad de México',
                capacity: 10000,
                isActive: true
            },
            {
                name: 'Almacén Norte MTY',
                code: 'MTY-001',
                address: 'Blvd. Díaz Ordaz 567',
                city: 'Monterrey',
                capacity: 7500,
                isActive: true
            }
        ]);
        console.log('🏘️  Warehouses seeded');

        // 3. Seed Products
        const products = await Product.insertMany([
            {
                name: 'Laptop Dell XPS 15',
                sku: 'LAP-DELL-XPS15',
                category: 'Electrónicos',
                description: 'Laptop profesional 15"',
                minStock: 10,
                price: 1499.99,
                cost: 1100.00,
                unit: 'pieza',
                supplierId: suppliers[0]._id
            },
            {
                name: 'Monitor LG 27"',
                sku: 'MON-LG-27',
                category: 'Electrónicos',
                description: 'Monitor 4K',
                minStock: 5,
                price: 399.99,
                cost: 250.00,
                unit: 'pieza',
                supplierId: suppliers[0]._id
            },
            {
                name: 'Mouse Logitech MX Master 3S',
                sku: 'MOU-LOG-MX3S',
                category: 'Accesorios',
                description: 'Mouse ergonómico',
                minStock: 30,
                price: 99.99,
                cost: 65.00,
                unit: 'pieza',
                supplierId: suppliers[1]._id
            }
        ]);
        console.log('📦 Products seeded');

        // 4. Seed Movements (Historical data)
        const movements = [];
        const types: ('entrada' | 'salida')[] = ['entrada', 'salida'];

        for (let i = 0; i < 20; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const product = products[Math.floor(Math.random() * products.length)];
            const warehouse = warehouses[Math.floor(Math.random() * warehouses.length)];

            movements.push({
                productId: product._id,
                warehouseId: warehouse._id,
                type,
                quantity: type === 'entrada' ? 50 : 10,
                reason: type === 'entrada' ? 'Compra a proveedor' : 'Venta a cliente',
                date: new Date(Date.now() - Math.random() * 86400000 * 30) // Last 30 days
            });
        }
        await Movement.insertMany(movements);
        console.log('📉 Movements seeded');

        // 5. Seed Settings
        await Settings.create({
            themeId: 'light-corporate',
            companyName: 'InventoryPro SaaS (Atlas Edition)',
            customColors: {
                primary: '#2563eb',
                secondary: '#64748b',
                accent: '#f59e0b'
            }
        });
        console.log('⚙️  Settings seeded');

        // 6. Seed Admin User
        await User.create({
            name: 'Carlos Administrador',
            email: 'admin@techlogistics.com',
            password: 'admin123',
            role: 'admin',
            isActive: true
        });
        console.log('👤 Admin user seeded');

        console.log('✅ Seeding completed successfully');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
