import React, { useState } from "react";
import './styles.css';

const operators = /[\+\-\÷x%]/

export default function Calculator() {
    const [value, setValue] = useState(" ")
    const [finalValue, setFinalValue] = useState(" ")

    const [valSize, setValSize] = useState("40px")
    const [resultSize, setResultSize] = useState("28px")

    const handleSize = (val) => {
        return val.length > 11 ? setValSize("28px") : setValSize("40px")
    }

    const handleResultSize = (res) => {
        return res.length > 14 ? setResultSize("20px") : setResultSize("35px")
    }

    const errseScreen = () => {
        setValue(" ")
        setFinalValue(" ")
    }

    const erraseChar = () => {
        if(value == "Error") {
            setValue(" ")
            setFinalValue(" ")
        } else {
            let ac = value.slice(0, value.length - 1)
            setValue(ac)
        }
    }

    const wronDecimals = (segmentos) => {   //se encarga de verificar que los decimales sean correctos
        const expression = /\..*\./;        //expresion para verificar si hay mas de una coma en un decimal
        let decimals = 0
        segmentos.forEach(segm => {
            if(expression.test(segm)) {
                decimals += 1
            }
        });
        return decimals 
    }

    const doOperation = (currentValue, operator, nextValue) => {
        console.log(currentValue)
        console.log(operator)
        console.log(nextValue)
        switch(operator) {
            case "÷":
                return currentValue / nextValue
            case "x":
                return currentValue * nextValue
            case "+":
                return currentValue + nextValue
            case "-":
                return currentValue - nextValue
        }
    }   

    const finishCalculation = () => {
        let result = 0
        let valAlreadyCalculated = finalValue ? Number(finalValue) : 0
        const segmentos = value.match(/(?:\d+\.{2,}\d+|\d+\.\d+|\d+|[+\-\÷x%])/g);   //separa por segmentos tanto operadores como numeros y numeros decimales
       
        if(operators.test(value[value.length - 1]) || wronDecimals(segmentos) > 0) {    //verifica que la cuenta no comience con un operador y que haya decimales correctos
            result = "Error"
        } else {
            for (let i = 0; i < segmentos.length; i += 2) {
                if(segmentos.length == 1) {              //si se escribe un solo valor se muestra como el resultado
                    result = segmentos[i]                  
                } 
                else if(Number(finalValue) > 0) {                  //si resultado es mas grande que 0, es decir que ya habia una cuenta realizada
                    if(!operators.test(segmentos[0])) {
                        result = i === 0 ? Number(segmentos[i]) : doOperation(Number(result), segmentos[i - 1], Number(segmentos[i]));
                    } else {
                        valAlreadyCalculated = doOperation(Number(valAlreadyCalculated), segmentos[i], Number(segmentos[i + 1]))
                        result = valAlreadyCalculated
                    }
                    console.log(result)
                } else {
                    result = i === 0 ? Number(segmentos[i]) : doOperation(Number(result), segmentos[i - 1], Number(segmentos[i]));
                }
              }
        }
        
        if(finalValue && !operators.test(segmentos[0])) {
            result = Number(result) + Number(finalValue)
        } else if(finalValue && operators.test(segmentos[0])) {
            result = valAlreadyCalculated
        }

        setValue(" ")                   
        setFinalValue(result.toString())
        handleResultSize(result.toString())
    }

    const handleValue = (e) => {
        const numExpression = /number/
        const operExpression = /operator/
        const isOperator = operExpression.test(e.target.className) ?? e.target.value
        const isNumber = numExpression.test(e.target.className) ?? e.target.value  

        if(value == " " && isOperator && finalValue == " ") return       //para que la cuenta no comienze con un operador 
                                                                         //si es que no se realizo una cuenta antes
        if(value.length < 17 && value !== "Error") {                    //maximo de la screen y que no haya error 
            if(!operators.test(value[value.length - 1])) {      //condicion para que no se repitan operadores seguidos
                setValue(value + e.target.value)
            } else if(isNumber || value == ".") {                           
                setValue(value + e.target.value)
            }
        }
        handleSize(value)
    }

    return (
        <>
            <div id="calculator">
                <div id="screen">
                    <span id="result" style={{fontSize: resultSize}}>{finalValue}</span>
                    <span id="value" style={{fontSize: valSize}}>{value}</span>
                </div>
                <button id="k-ac" className="key ad-key" onClick={erraseChar}>AC</button>
                <button id="k-del" className="key ad-key" onClick={errseScreen}>DEL</button>
                <button id="k-%" className="key ad-key" value="%" onClick={handleValue}>%</button>
                <button id="k-divide" className="key operator" value="÷" onClick={handleValue}>÷</button>
                <button id="k-7" className="key number" value="7" onClick={handleValue}>7</button>
                <button id="k-8" className="key number" value="8" onClick={handleValue}>8</button>
                <button id="k-9" className="key number" value="9" onClick={handleValue}>9</button>
                <button id="k-equal" className="key operator" value="=" onClick={finishCalculation}>=</button>
                <button id="k-multi" className="key operator" value="x" onClick={handleValue}>x</button>
                <button id="k-4" className="key number" value="4" onClick={handleValue}>4</button>
                <button id="k-5" className="key number" value="5" onClick={handleValue}>5</button>
                <button id="k-6" className="key number" value="6" onClick={handleValue}>6</button>
                <button id="k-plus" className="key operator" value="+" onClick={handleValue}>+</button>
                <button id="k-1" className="key number" value="1" onClick={handleValue}>1</button>
                <button id="k-2" className="key number" value="2" onClick={handleValue}>2</button>
                <button id="k-3" className="key number" value="3" onClick={handleValue}>3</button>
                <button id="k-less" className="key operator" value="-" onClick={handleValue}>-</button>
                <button id="k-0" className="key number" value="0" onClick={handleValue}>0</button>
                <button id="k-dot" className="key dot" value="." onClick={handleValue}>.</button>
            </div>
        </>
    )
}

/* COSAS A REVISAR */
/* -- Trabajar con numeros negativos */
/* -- Trabajar con porcentaje */
/* -- Ver cuando la cuenta comienza con operador y con finalValue esta vacio*/
/* -- Ver cuando la cuenta termina con operador y con finalValue esta vacio */