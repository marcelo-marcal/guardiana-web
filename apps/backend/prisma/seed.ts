// ================================
// IMPORTS
// ================================
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

// ================================
// PRISMA CLIENT
// ================================
const prisma = new PrismaClient();

// ================================
// USUÁRIOS INICIAIS DO SISTEMA
// ================================
const initialUsers = [
    {
        name: "Super Admin",
        email: "superadmin@guardiana.com",
        password: "Super@123456",
        role: UserRole.SUPER_ADMIN,
    },
    {
        name: "Admin 01",
        email: "admin01@guardiana.com",
        password: "Admin@123456",
        role: UserRole.ADMIN,
    },
    {
        name: "Admin 02",
        email: "admin02@guardiana.com",
        password: "Admin@123456",
        role: UserRole.ADMIN,
    },
    {
        name: "Admin 03",
        email: "admin03@guardiana.com",
        password: "Admin@123456",
        role: UserRole.ADMIN,
    },
];

// ================================
// SEED PRINCIPAL
// ================================
async function main() {
    for (const user of initialUsers) {
        const passwordHash = await bcrypt.hash(user.password, 10);

        await prisma.user.upsert({
            where: {
                email: user.email,
            },
            update: {
                name: user.name,
                role: user.role,
                passwordHash,
                status: "ACTIVE",
            },
            create: {
                name: user.name,
                email: user.email,
                role: user.role,
                passwordHash,
                status: "ACTIVE",
            },
        });
    }

    console.log("Seed executado com sucesso.");
}

// ================================
// EXECUÇÃO
// ================================
main()
    .catch((error: unknown) => {
        console.error("Erro ao executar seed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });