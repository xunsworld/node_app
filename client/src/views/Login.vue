<template>
    <div class="long-form__wrapper">
        <vk-form :model="formModel" :rules="formRules" ref="formRef">
            <vk-form-item label="邮箱" prop="email">
                <vk-input v-model="formModel.email" type="email"
                          placeholder="Please enter your email." />
            </vk-form-item>
            <vk-form-item label="密码" prop="password" showPassword>
                <vk-input v-model="formModel.password" type="password"
                          placeholder="Please enter your password." />
            </vk-form-item>
            <el-alert v-if="auth.error" type="error">{{ auth.error }}</el-alert>
            <vk-button type="primary" :disabled="auth.isLoading" @click.prevent="handleSubmit">
                {{ auth.isLoading ? '登录中...' : '登录' }}
            </vk-button>
            <RouterLink to="/register"
                        style="color: red; text-align: right;float: inline-end;line-height: 32px;">
                账号注册</RouterLink>
        </vk-form>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from "vue-router"
const auth = useAuthStore()
const formRef = ref()
const router = useRouter()
const formModel = reactive({
    email: '',
    password: ''
})
const formRules = {
    email: [
        { type: 'email', required: true, trigger: 'blur' }
    ],
    password: [
        { type: 'string', required: true, trigger: 'blur', min: 6, max: 10 }
    ]
}

const handleSubmit = async () => {
    try {
        const isValid = await formRef.value.validate()
        if (isValid) {
            const isSuccess = await auth.login(formModel.email, formModel.password)
            if (isSuccess) {
                router.push({ name: 'home' })
            }
        }
    } catch (error) {
        // 错误已由 store 处理

    }
}
</script>

<style scoped>
.long-form__wrapper {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-image: radial-gradient(var(--bg-color-primary-light-2), var(--bg-color-primary-light-8), var(--bg-color-primary));

    >form {
        min-width: 400px;

        >button {
            min-width: 80px;
        }
    }
}
</style>