import React from "react";
import { useForm } from "react-hook-form";

function App() {

  const {
    register, // метод, позволяющий регистрировать различные поля для формы
    formState: { // объект состояния формы
      errors,
      isValid,
    },
    handleSubmit, // обёртка для нашего кастомного хендлера onSubmit
    reset, // автоматическая чистка формы
    watch // следит за изменениями в форме
  } = useForm({
    mode: 'onChange' // настройка поведения валидации
  })

  const onSubmit = (data) => {
    alert(JSON.stringify(data))
    reset()
  }

  const calcAge = (dateString) => {
    const today = new Date()
    const birthdayDate = new Date(dateString)
    let age = today.getFullYear() - birthdayDate.getFullYear()
    const m = today.getMonth() - birthdayDate.getMonth()

    if (m < 0 || m === 0 && today.getDate() < birthdayDate.getDate()) {
      age--
    }
    return age
  }

  const password = watch('password')
  //const match = watch('match')

  return (
    <div className="App">
      <h1>Валидация при помощи React-hook-form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Имя:
          <input
            // распаковываем деструтуризацией значения типа name, value и методы этого объекта, типа onChange, onBlur и тд
            {...register('firstname' /*name*/,
              { /*валидация*/
                required: 'Поле обязательно к заполнению!',
                minLength: {
                  value: 2,
                  message: 'Минимум два символа'
                },
              },
            )}
          />
        </label>
        {errors?.firstname && <p>{errors?.firstname?.message || 'Error!'}</p>}

        <label>
          Фамилия:
          <input
            {...register('lastname', {
              required: 'Поле обязательно к заполнению!',
              minLength: {
                value: 2,
                message: 'Минимум два символа'
              },
            },
            )}
          />
        </label>
        {errors?.lastname && <p>{errors?.lastname?.message || 'Error!'}</p>}

        <label>
          Дата рождения:
          <input type='date'
            {...register('birthday', {
              required: 'Поле обязательно к заполнению!',
              valueAsDate: true,
              validate: {
                lessThanEighteen: v => calcAge(v) > 18, // передаем коллбек, возвращающее boolean значение проверки на возраст
              }
            },
            )}
          />
        </label>
        {errors?.birthday && <p>{'Вам нет 18ти!'}</p>}

        <label>
          Email:
          <input type='email'
            {...register('email', {
              required: 'Поле обязательно к заполнению!',
            },
            )}
          />
        </label>
        {errors?.email && <p>{errors?.email?.message || 'Форма заполнена неверно!'}</p>}

        <label>
          Пароль:
          <input type='password'
            {...register('password', {
              required: 'Поле обязательно к заполнению!',
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
                message: 'Пароль должен содержать покрайней мере одну строчную букву, одну заглавную букву, одну цифру и один из символов: !@#$%. От 8 до 24-х символов.'
              },
            },
            )}
          />
        </label>
        {errors?.password && <p>{errors?.password?.message || 'Error!'}</p>}

        <label>
          Подтвердите пароль:
          <input type='password'
            {...register('match', {
              required: 'Поле обязательно к заполнению!',
              validate: {
                isMatch: v => v === password,
              }
            },
            )}
          />
        </label>
        {errors?.match && <p>{errors?.match?.message || 'Пароли не совпадают!'}</p>}

        <input type='submit' disabled={!isValid}></input>
      </form>
    </div>
  );
}

export default App;
