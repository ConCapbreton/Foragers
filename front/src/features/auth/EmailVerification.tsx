import React, { useEffect } from "react"
import { useState, useRef } from "react"
import { ModNextCompProps } from "../../components/modal/Modal";

type SubmitEventType = React.FormEvent<HTMLFormElement> | Event;

const EmailVerification: React.FC<ModNextCompProps> = ({setNextPage}) => {
    const [code, setCode] = useState<string[]>(["", "", "", "", "", ""])
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    
    const handleChange = (index: number, value: string) => {
        const newCode: string[] = [...code]

        if (value.length > 1) {
            const pastedCode = value.slice(0, 6).split("")
            for (let i = 0; i < 6; i++) {
                newCode[i] = pastedCode[i] || ""
            }
            setCode(newCode)

            let lastFilledIndex = newCode.findIndex((empty: string) => empty === "")
            const focusIndex = lastFilledIndex === -1 ? 5 : lastFilledIndex
            inputRefs.current[focusIndex]?.focus()

        } else {
            newCode[index] = value
            setCode(newCode)

            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus()
            }
        }
    }

    const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
        if (event.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleSubmit = (event: SubmitEventType) => {
        event.preventDefault()
        const verificationCode = code.join("")
        console.log(verificationCode)
    }

    useEffect(() => {
        if (code.every(digit => digit !== "")) {
            handleSubmit(new Event('submit'))
        }
    }, [code])
    
    return (
    <form id="verify-email-form" onSubmit={handleSubmit}>
        <h2>Verify your email</h2>
        <p id="verify-email-msg">Enter the 6 digit code sent to your email address</p>
        <div id="verify-inputs-div">
            {code.map((digit, index) => (
                <input 
                    key={index}
                    ref={(el) => {(inputRefs.current[index] = el)}}
                    type='text'
                    maxLength={6}
                    value={digit}
                    onChange={(event) => handleChange(index, event.target.value)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    className="verify-inputs"
                />
            ))}
        </div>
        <button className="btn verify-email-submit">Verify Email</button>
        <button className="back-page link" type="button" onClick={() => {setNextPage(false)}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
            </svg>
            <p>Back to Sign Up</p>
        </button>
    </form>
  )
}

export default EmailVerification
