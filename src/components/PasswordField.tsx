import { IconButton, InputAdornment, TextField } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react'
import { UseFormRegister } from 'react-hook-form';

interface PasswordFieldProps {
    register: UseFormRegister<any>
    field: string
    label: string
    rules: {
        required?: boolean | string
        validate?: any
    }
    size?: any
}

const PasswordField = ({ register, field, label, rules, size }: PasswordFieldProps) => {

    const [showPassword, setShowPassword] = useState(false)

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }


    return (
        <TextField
            size={size ?? "medium"}
            label={label}
            type={showPassword ? 'text' : 'password'}
            fullWidth
            variant="filled"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
            {...register(field, rules)}
        />
    )
}

export default PasswordField