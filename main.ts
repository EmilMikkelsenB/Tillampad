// # !!!! OBS BLIR NÅGOT KONSTIGT NÄR MAN TAR KODEN TILLBAKA TILL BLOCK !!!! ##
let alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
let morseAlphabet = [".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--.."]
radio.setGroup(255)
radio.sendNumber(1)
let randomNum = randint(0, alphabet.length - 1)
let messagePart = ""
let message : string[] = []
let sender = true
let idx = 0
//  For pagenation
//  delar array till sträng
function split(string: string, delimiters: string = " \t\n"): string[] {
    let result = []
    let word = ""
    for (let c of string) {
        if (delimiters.indexOf(c) < 0) {
            word += c
        } else if (word) {
            result.push(word)
            word = ""
        }
        
    }
    if (word) {
        result.push(word)
    }
    
    return result
}

//  gör om till sträng
function sendMessage(msg: string[] = [""]) {
    let m = ""
    for (let i of msg) {
        m += i + ";"
    }
    radio.sendString(m)
}

//  gör morse till vanligt alfabet
function translateMessage(msg: any[]): string {
    let output = ""
    for (let m of msg) {
        if (morseAlphabet.indexOf(m) >= 0) {
            output += alphabet[_py.py_array_index(morseAlphabet, m)]
        }
        
    }
    return output
}

function showMorse(string: string) {
    let Y = 0
    //  nollställer rad
    basic.clearScreen()
    //  loop genom "kort" och "lång" bestämmer vad som ska plottas
    for (let n of string) {
        if (Y < 5) {
            if (n == ".") {
                led.plot(0, Y)
                led.plot(1, Y)
            } else if (n == "-") {
                led.plot(0, Y)
                led.plot(1, Y)
                led.plot(2, Y)
                led.plot(3, Y)
            }
            
        }
        
        Y += 1
    }
}

//  Kollar ifall inputen är registrerad i morseAlphabet
function checkMessage(msgPart: string): boolean {
    showMorse(msgPart)
    if (!(morseAlphabet.indexOf(msgPart) >= 0)) {
        basic.showLeds(`
            . . # # .
            . # . . #
            . . . # .
            . . . . .
            . . # . .
            `, 1000)
        return false
    }
    
    return true
}

//  varje gång ab trycks så "sparas ordet "
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    if (sender) {
        messagePart += "."
        showMorse(messagePart)
    } else {
        //  Subtraherar 1 till index
        idx -= 1
        //  Sätter idx till max ifall man går under det lägsta
        if (idx < 0) {
            idx = message.length - 1
        }
        
        //  Visar input
        showMorse(message[idx])
    }
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
    if (sender) {
        messagePart += "-"
        showMorse(messagePart)
    } else {
        //  Adderar 1 till index för att visa nästa tecknet
        idx += 1
        //  gräns på index
        if (idx > message.length - 1) {
            idx = 0
        }
        
        //  Visar input
        showMorse(message[idx])
    }
    
})
input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    
    if (sender) {
        //  medelandet behöver vara större än 0 för att skickas
        if (messagePart == "") {
            if (message.length > 0) {
                basic.showString(translateMessage(message))
                sendMessage(message)
                basic.clearScreen()
                message = []
            } else {
                basic.showIcon(IconNames.No)
            }
            
        } else {
            if (checkMessage(messagePart) == true) {
                message.push(messagePart)
            }
            
            messagePart = ""
        }
        
    } else {
        //  Visar det skickade i bokstäver
        basic.showString(translateMessage(message))
        sender = true
        message = []
    }
    
    basic.clearScreen()
})
input.onGesture(Gesture.Shake, function on_gesture_shake() {
    
    //  rensar på skakning
    if (sender) {
        messagePart = ""
        basic.clearScreen()
    }
    
})
radio.onReceivedString(function on_received_string(receivedString: string) {
    
    if (split(receivedString, ";").length > 0) {
        sender = false
        message = split(receivedString, ";")
        //  "-..;--;-.-." --> ["-..", "--", "-.-."]
        showMorse(message[idx])
    }
    
})
