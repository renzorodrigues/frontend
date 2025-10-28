<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { Check, Circle, Dot, ChevronRight, ChevronLeft, Save } from "lucide-vue-next"
import { ref, computed } from "vue"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ZodType } from 'zod'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Stepper, StepperDescription, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from "@/components/ui/stepper"
import { toast } from "@/components/ui/toast/use-toasts"

const stepIndex = ref(1)
const steps = [
  {
    step: 1,
    title: "Informações Pessoais",
    description: "Preencha seus dados pessoais",
  },
  {
    step: 2,
    title: "Endereço",
    description: "Informe seu endereço",
  },
  {
    step: 3,
    title: "Contatos",
    description: "Informe seus contatos",
  },
]

// Regex para os formatos com pontuação
const auth = useAuthStore()
const username = ref(auth.user?.name.toUpperCase() || '')
const emit = defineEmits(['completed'])
const docType = ref<'cpf' | 'cnpj'>('cpf')
const birthDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
useForm()

const mask = computed(() => {
  return docType.value === 'cpf'
    ? '###.###.###-##'
    : '##.###.###/####-##'
})

const currentSchema = computed(() => {
  const index = stepIndex.value - 1
  return formSchema[index] ?? formSchema[0]
})

async function onSubmit(values: any) {
  const userStore = useUserStore()
  try {
    await auth.refresh()
    await userStore.updateUser(values)
    await auth.refresh()

    if (auth.user_status === 'ACTIVE') {
      toast({
        title: 'Conta ativada!',
        description: 'Seu cadastro foi atualizado e a conta está ativa',
      })
      emit('completed')
    } else {
      toast({
        title: 'Cadastro atualizado',
        description: 'Seu cadastro foi atualizado, mas a conta ainda não está ativa.',
      })
    }
  } catch (error) {
    toast({
      title: 'Erro ao atualizar',
      description: 'Não foi possível salvar as alterações.',
    })
  }
}

const formSchema = [
  z.object({
    cpfCnpj: z.string().min(1, { message: 'O campo é obrigatório' }),
    birthDate: z.string()
      .regex(birthDateRegex, { message: "Use o formato DD/MM/AAAA" })
      .refine(value => {
        if (!birthDateRegex.test(value)) return false;

        const [dayStr, monthStr, yearStr] = value.split("/");
        const day = Number(dayStr);
        const month = Number(monthStr);
        const year = Number(yearStr);

        if (isNaN(day) || isNaN(month) || isNaN(year)) return false;

        // ✅ Verifica se a data realmente existe
        const date = new Date(year, month - 1, day);
        const validDate =
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day;

        if (!validDate) return false;

        // ✅ Verifica se é pelo menos 5 anos atrás
        const today = new Date();
        const minDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());

        return date <= minDate;
      }, {
        message: "Data de nascimento inválida."
      })
      .transform(value => {
        if (!birthDateRegex.test(value)) return null;
        const [dayStr, monthStr, yearStr] = value.split("/");
        const day = Number(dayStr);
        const month = Number(monthStr);
        const year = Number(yearStr);
        return new Date(year, month - 1, day);
      }),
  }),
  z.object({
    street: z.string().min(2).max(50),
    number: z.string(),
  }),
]
</script>
<template>
  <Form v-slot="{ meta, values, validate, setFieldValue }" as="" keep-values
    :validation-schema="toTypedSchema(currentSchema as ZodType<any>)">
    <Stepper v-slot="{ isNextDisabled, isPrevDisabled, nextStep, prevStep }" v-model="stepIndex" class="block w-full">
      <form @submit="(e) => {
        e.preventDefault()
        validate()

        if (stepIndex === steps.length && meta.valid) {
          onSubmit(values)
        }
      }">
        <div class="flex w-full flex-start gap-2">
          <StepperItem v-for="step in steps" :key="step.step" v-slot="{ state }"
            class="relative flex w-full flex-col items-center justify-center" :step="step.step">
            <StepperSeparator v-if="step.step !== steps[steps.length - 1]?.step"
              class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary" />

            <StepperTrigger as-child>
              <Button :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'" size="icon"
                class="z-10 rounded-full shrink-0"
                :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']"
                :disabled="state !== 'completed' && !meta.valid">
                <Check v-if="state === 'completed'" class="size-5" />
                <Circle v-if="state === 'active'" />
                <Dot v-if="state === 'inactive'" />
              </Button>
            </StepperTrigger>

            <div class="mt-5 flex flex-col items-center text-center">
              <StepperTitle :class="[state === 'active' && 'text-primary']"
                class="text-sm font-semibold transition lg:text-base">
                {{ step.title }}
              </StepperTitle>
              <StepperDescription :class="[state === 'active' && 'text-primary']"
                class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm">
                {{ step.description }}
              </StepperDescription>
            </div>
          </StepperItem>
        </div>
        <!-- STEP INDEX 1 -->
        <template v-if="stepIndex === 1">
          <!-- 1ª linha: Nome -->
          <div class="w-full grid md:grid-cols-1 gap-4 mt-6">
            <FormItem class="w-full">
              <label for="username"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Nome
              </label>
              <Input id="username" type="text" v-model="username" class="w-full" disabled />
            </FormItem>
          </div>

          <!-- 2ª linha: cpfCnpj / Data de Nascimento -->
          <div class="w-full grid md:grid-cols-[2fr_1fr] gap-4 mt-3 items-start">
            <!-- cpfCnpj -->
            <FormField v-slot="{ componentField }" name="cpfCnpj">
              <FormItem class="w-full">
                <FormLabel for="cpfCnpj">
                  <RadioGroup v-model="docType" class="flex items-center space-x-4"
                    @update:modelValue="() => setFieldValue('cpfCnpj', '')">
                    <div class="flex items-center space-x-2">
                      <RadioGroupItem id="cpf" value="cpf" />
                      <Label for="cpf">CPF</Label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <RadioGroupItem id="cnpj" value="cnpj" />
                      <Label for="cnpj">CNPJ</Label>
                    </div>
                  </RadioGroup>
                </FormLabel>
                <FormControl>
                  <Input v-mask="mask" type="text" v-bind="componentField" class="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Data de Nascimento -->
            <FormField v-slot="{ componentField, meta }" name="birthDate">
              <FormItem class="w-full">
                <FormLabel for="birthDate">Data de Nascimento</FormLabel>
                <FormControl>
                  <Input v-mask="'##/##/####'" type="text" v-bind="componentField" class="w-full" />
                </FormControl>
                <FormMessage v-if="meta.touched || meta.dirty" />
              </FormItem>
            </FormField>
          </div>
        </template>


        <template v-if="stepIndex === 2">
          <!-- 1ª linha: Rua / Número -->
          <div class="w-full grid md:grid-cols-[3fr_1fr] gap-4 mt-6">
            <FormField v-slot="{ componentField }" name="street">
              <FormItem class="w-full">
                <FormLabel for="street">Rua</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" class="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="number">
              <FormItem class="w-full">
                <FormLabel for="number">Número</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" class="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- 2ª linha: Complemento / Bairro -->
          <div class="w-full grid md:grid-cols-[1fr_1fr] gap-4 mt-3">
            <FormField v-slot="{ componentField }" name="complement">
              <FormItem class="w-full">
                <FormLabel for="complement">Complemento</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" class="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="neighborhood">
              <FormItem class="w-full">
                <FormLabel for="neighborhood">Bairro</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" class="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- 3ª linha: CEP / Cidade / Estado -->
          <div class="w-full grid md:grid-cols-[1fr_2fr_1fr] gap-4 mt-3">
            <FormField v-slot="{ componentField }" name="postalCode">
              <FormItem class="w-full">
                <FormLabel for="postalCode">CEP</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" class="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="city">
              <FormItem class="w-full">
                <FormLabel for="city">Cidade</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" class="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="state">
              <FormItem class="w-full">
                <FormLabel for="state">Estado</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="SP">São Paulo</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

        </template>

        <template v-if="stepIndex === 3">
          <!-- 2ª linha: Complemento / Bairro -->
          <div class="w-full grid md:grid-cols-[1fr_1fr] gap-4 mt-3">
            <FormField v-slot="{ componentField }" name="mobilePhoneNumber">
              <FormItem class="w-full">
                <FormLabel for="mobilePhoneNumber">Celular</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" class="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="landLinePhoneNumber">
              <FormItem class="w-full">
                <FormLabel for="landLinePhoneNumber">Fixo</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" class="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </template>

        <div class="flex items-center justify-between mt-4">
          <Button :disabled="isPrevDisabled" variant="outline" size="lg" @click="prevStep()">
            <ChevronLeft class="w-4 h-4 mr-2" /> Voltar
          </Button>
          <div class="flex items-center gap-3">
            <Button v-if="stepIndex !== 3" :type="meta.valid ? 'button' : 'submit'" :disabled="isNextDisabled" size="lg"
              @click="meta.valid && nextStep()">
              <ChevronRight class="w-4 h-4 mr-2" /> Próximo
            </Button>
            <Button v-if="stepIndex === 3" size="lg" type="submit">
              <Save class= "w-4 h-4 mr-2" /> Enviar
            </Button>
          </div>
        </div>
      </form>
    </Stepper>
  </Form>
</template>