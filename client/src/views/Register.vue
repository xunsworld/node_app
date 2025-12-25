<template>
    <div class="register-form__wrapper">
        <vk-form :model="formModel" :rules="formRules" ref="formRef">
            <vk-form-item label="用户名" prop="name">
                <vk-input v-model="formModel.name" type="text"
                          placeholder="Please enter your  username." />
            </vk-form-item>
            <vk-form-item label="邮箱" prop="email">
                <vk-input v-model="formModel.email" type="email"
                          placeholder="Please enter your email." />
            </vk-form-item>
            <vk-form-item label="密码" prop="password" showPassword>
                <vk-input v-model="formModel.password" type="password"
                          placeholder="Please enter your password." />
            </vk-form-item>
            <el-alert v-if="registerError" type="error">{{ registerError }}</el-alert>
            <vk-button type="primary" :disabled="isLoading" @click.prevent="handleSubmit">
                {{ isLoading ? '注册中...' : '注册' }}
            </vk-button>
            <vk-button @click.prevent="handleClear">
                清空
            </vk-button>

        </vk-form>
    </div>
</template>


<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from "vue-router"
import { register } from '@/apis/users'
const formRef = ref()
const router = useRouter()
const formModel = reactive({
    name: "",
    email: '',
    password: ''
})
const isLoading = ref(false)
const registerError = ref('')
const formRules = {
    name: [
        {
            type: 'string', required: true, pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]{3,20}$/,
            transform(value: string) {
                return value.trim();
            }, message: '用户名必须是3-20位的字母、数字、下划线、中文字符', trigger: 'blur'
        }
    ],
    email: [
        { type: 'email', required: true, trigger: 'blur' }
    ],
    password: [
        { type: 'string', required: true, trigger: 'blur', min: 6, max: 10 }
    ]
}

const handleSubmit = async () => {
    let isValid = false
    try {
        isValid = await formRef.value.validate()
        if (isValid) {
            isLoading.value = true
            const isSuccess = await register(formModel.name, formModel.email, formModel.password)
            if (isSuccess) {
                router.push({ name: 'login' })
            }
            isLoading.value = false
        }
    } catch (error: any) {
        if (isValid) {
            registerError.value = error.response?.data?.msg || error.message || '注册失败'
        }
        isLoading.value = false
    }
}

const handleClear = () => {
    formRef.value.resetFields()
}
</script>

<style scoped>
.register-form__wrapper {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-image: radial-gradient(var(--bg-color-primary-light-2), var(--bg-color-primary-light-8), var(--bg-color-primary));

    >form {
        min-width: 480px;

        >button {
            min-width: 80px;
        }
    }
}
</style>