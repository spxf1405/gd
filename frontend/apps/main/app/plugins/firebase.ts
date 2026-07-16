import { initializeApp } from '@firebase/app'
import { getAuth } from '@firebase/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const app = initializeApp(config.public.firebase)
  const auth = getAuth(app)

  return {
    provide: {
      firebaseApp: app,
      firebaseAuth: auth
    }
  }
})