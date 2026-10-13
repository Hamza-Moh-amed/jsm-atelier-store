"use client"

import { signIn } from '@/lib/auth-actions'
import { emptyAuthState } from "@/lib/auth-form-state";
import { useActionState } from 'react'

const SignInForm = ({next}: {next: string}) => {
    const [state, action, pending] = useActionState(signIn, emptyAuthState);
    return (
    <form action={action} className='stack-lg'>

        {state.error ? (
            <p role='alert' className='type-meta text-oxblood'>{state.error}</p>
        ): null}

        <div>
            <label htmlFor="email" className="field-label" >
                Emaill Address
            </label>
            <input
            id='email'
            name='email'
            type='email'
            required
            autoComplete='email'
            placeholder='you@example.com'
            className='field'
            />
        </div>

        <div>
            <label htmlFor="password" className="field-label" >
                Password
            </label>
            <input
            id='password'
            name='password'
            type='password'
            required
            autoComplete='current-password'
            className='field'
            />
        </div>

        <input type='hidden' name='next' value={next} />

        <button
        type='submit'
        disabled={pending}
        className='btn btn-primary btn-block sm:min-w-56'
        >
            {pending ? "Signing in..." : "Sign in"}
        </button>


    </form>         
  )
}

export default SignInForm