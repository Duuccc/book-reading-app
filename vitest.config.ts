import { defineConfig } from "vitest/config"
import { loadEnv } from "vite"

// export default defineConfig(({ mode }) => ({
//     test: {
//         globals: true,
//         environment: "node",
//         setupFiles: ["./src/testing/setup.ts"],
//         env: loadEnv("test", process.cwd(), ""),
//         fileParallelism: false
//     }
// }))

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        setupFiles: ["./src/testing/setup.ts"],
    }
})