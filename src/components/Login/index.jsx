import { useFormik } from "formik"
import * as yup from 'yup';

import { useState } from "react";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";





const Login = (props) => {

    const [isError, setIsError] = useState(false);
    const [loginError, setLoginError] = useState("");
    let newError = "";

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },

        validationSchema:

            yup.object({

                email: yup
                    .string('Enter your email')
                    .required('Email is required')
                    .email("Enter a valid Email ")
                    .min(3, "please enter more then 3 characters ")
                    .max(25, "please enter within 20 characters "),

                password: yup
                    .string("Please enter your Password")
                    .required("Password is required")
                    .min(8, "Minimum 8 characters")
            }),

        onSubmit: (values) => {
            // console.log("values : ", values);
            // console.log("Hello");
            // (() => {
            //     let newVar = !props.state
            //     props.setState(newVar);
            //     console.log("isSignup :", props.state);
            // })();


            const auth = getAuth();

            signInWithEmailAndPassword(auth, values.email, values.password)

                .then((userCredential) => {

                    (() => {
                        let newVar = !props.state
                        props.setState(newVar);
                        console.log("isSignup :", props.state);
                    })();

                    const user = userCredential.user;
                    console.log("login successful: ");
                    console.log("login User: ", user);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log("firebase Login Error: ", errorCode, "=====", errorMessage);
                    setIsError(true);

                    errorCode.split("/")[1].split("").map(eachIndex => {

                        if (eachIndex === "-") {

                            eachIndex = " ";
                        }

                        newError += eachIndex;
                    })
                    // setLoginError(newError);
                    console.log("newError :", newError);
                    setLoginError(newError)
                    // setLoginError(newError);
                    // console.log("loginError :", loginError);
                });
        }
    });

    return (
        <div className="loginPage">

            <h1> Login </h1>

            <form onSubmit={formik.handleSubmit}>

                <div className="inputDiv">
                    <label htmlFor="email">Email : </label>
                    <input
                        type="email"
                        id="email"
                        value={formik.values.email}
                        placeholder="Enter your Email :"
                        onChange={formik.handleChange}
                    />
                    {(formik.touched.email && Boolean(formik.errors.email)) ?
                        <p className="inputError">{formik.errors.email}</p> : <p className="inputError"></p>}
                </div>

                <div className="inputDiv">
                    <label htmlFor="password">Password : </label>
                    <input
                        type="password"
                        id="password"
                        value={formik.values.password}
                        placeholder="Enter your password :"
                        onChange={formik.handleChange}
                    />
                    {(formik.touched.password && Boolean(formik.errors.password)) ?
                        <p className="inputError">{formik.errors.password}</p> : <p className="inputError"></p>}
                </div>


                <button type="submit">Login</button>
            </form>
            {(isError) ?
                <p className="fbError"> {loginError} </p>
                : ""
            }
        </div>
    )
}


export default Login;