## !!!! OBS BLIR NÅGOT KONSTIGT NÄR MAN TAR KODEN TILLBAKA TILL BLOCK !!!! ##

alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
morseAlphabet = [".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--.."]

radio.set_group(255)
radio.send_number(1)

randomNum = randint(0, len(alphabet) - 1)

messagePart = ""
message: List[str] = []

sender = True
idx = 0 # For pagenation

# delar array till sträng
def split(string, delimiters = ' \t\n'):
    result = []
    word = ''
    
    for c in string:
        if c not in delimiters:
            word += c
        elif word:
            result.append(word)
            word = ''

    if word:
        result.append(word)

    return result


# gör om till sträng
def sendMessage(msg = [""]):
    m = ''

    
    for i in msg:
        m += i + ';'

    radio.send_string(m)


# gör morse till vanligt alfabet
def translateMessage(msg):
    output = ""

    for m in msg:
        if m in morseAlphabet:
            output += alphabet[morseAlphabet.index(m)]
    
    return output


def showMorse(string):
    Y = 0 # nollställer rad
    basic.clearScreen()

    # loop genom "kort" och "lång" bestämmer vad som ska plottas
    for n in string:
        if Y < 5:
            if n == ".":
                led.plot(0, Y)
                led.plot(1, Y)
            elif n == "-":
                led.plot(0, Y)
                led.plot(1, Y)
                led.plot(2, Y)
                led.plot(3, Y)

        Y += 1


# Kollar ifall inputen är registrerad i morseAlphabet
def checkMessage(msgPart):
    showMorse(msgPart)
    
  
    if not (msgPart in morseAlphabet):
        basic.show_leds("""
            . . # # .
            . # . . #
            . . . # .
            . . . . .
            . . # . .
            """, 1000)
        return False

    return True


def on_button_pressed_a():
    global messagePart, sender, idx

    if sender:
        
        messagePart += "."

        showMorse(messagePart)
        
    else:
        # Subtraherar 1 till index
        idx -= 1
        
        # Sätter idx till max ifall man går under det lägsta
        if idx < 0:
            idx = len(message) - 1

        # Visar input
        showMorse(message[idx])


def on_button_pressed_b():
    global messagePart, sender, idx

    if sender:
        messagePart += "-"
        showMorse(messagePart)

    else:
        # Adderar 1 till index för att visa nästa tecknet
        idx += 1

        # gräns på index
        if idx > len(message) - 1:
            idx = 0
        
        # Visar input
        showMorse(message[idx])

# varje gång ab trycks så "sparas ordet "
def on_button_pressed_ab():
    global messagePart, message, sender

    if sender:
        
        # medelandet behöver vara större än 0 för att skickas
        if messagePart == "":
            if len(message) > 0:

                basic.show_string(translateMessage(message))
                sendMessage(message)

                basic.clearScreen()
         
              

                message = []
            else:
                basic.show_icon(IconNames.NO)
        else:

            if checkMessage(messagePart) == True:
                message.append(messagePart)

            messagePart = ""
  
    else:

        # Visar det skickade i bokstäver
        basic.show_string(translateMessage(message))

        sender = True
        message = []
    
    basic.clearScreen()
    

def on_gesture_shake():
    global messagePart, sender
    
    # rensar på skakning
    if sender:
        messagePart = ""
        basic.clearScreen()


def on_received_string(receivedString):
    global message, sender

    if len(split(receivedString, ';')) > 0 :
        sender = False
        message = split(receivedString, ';') # "-..;--;-.-." --> ["-..", "--", "-.-."]

        

        showMorse(message[idx])


input.on_button_pressed(Button.A, on_button_pressed_a)
input.on_button_pressed(Button.B, on_button_pressed_b)
input.on_button_pressed(Button.AB, on_button_pressed_ab)
input.on_gesture(Gesture.SHAKE, on_gesture_shake)

radio.on_received_string(on_received_string)



