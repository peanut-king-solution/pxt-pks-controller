# pxt-pks-controller

Peanut King micro:bit Shield V2 extension for bluetooth control. Dynamically configure a custom interface on a companion app and seamlessly interact with it using sliders, buttons, joysticks, and variables.

## Product URL

[Peanut KING micro:bit Shield V2 Extension Shield](https://www.peanutkingsolution.com/en/product-page/peanut-king-micro-bit-shield-v2-%E6%93%B4%E5%B1%95%E6%9D%BF)

## Summary

This extension exposes the main features of the Peanut Queen Controller to MakeCode for micro:bit. It handles the underlying Bluetooth UART protocol, state management, and data parsing automatically. It includes APIs for:

- Bluetooth connection management and auto-reconnection
- Dynamic GUI configuration (Sliders, Buttons, Toggles, Text Fields, Joysticks, and Variables)
- Reading real-time values from the app (Getters)
- Sending data back to the app with built-in throttling (Setters)
- Event-driven button press handling with automatic state resetting
- Smart state mapping with composite keys to prevent variable collisions

## Peanut Queen Controller

A data visualization and Bluetooth control application that lets users dynamically configure their GUI. By simply sending a configuration message to the mobile app, users can define exactly which data to visualize and what interactive controls to display.

[Peanut Queen Controller](https://play.google.com/store/apps/details?id=com.peanut.king.solution)


## Example: Setup and Configure GUI

Initialize the Bluetooth service, wait for the app to connect, and define the layout in the app's interface.

```blocks
// Start Bluetooth and display the micro:bit's name so the app can find it
pksController.setupBluetooth()
pksController.showDeviceName()

// Wait until the app connects before sending configuration
pksController.waitUntilConnected()

// Define the GUI layout
pksController.makeConfiguration([
    pksController.createButton("Fire"),
    pksController.createToggleButton("Mode"),
    pksController.createSlider(0, 255, "Speed"),
    pksController.createTextField("Status"),
    pksController.createJoystick("angle", 255, "power", "Movement"),
    pksController.formatVariablesList([
        pksController.createVariable("sensor1", true),
        pksController.createVariable("battery", false)
    ])
])
```

## Example: Read Values from App (Getters)

Access the current state of the app's GUI elements using the type-safe Getter blocks. These update in real-time as the user interacts with the app.

```blocks
basic.forever(function () {
    // Check if a button is pressed
    if (pksController.isButtonToggled("Fire")) {
        basic.showIcon(IconNames.Sword)
    }

    // Get a slider's value
    let speed = pksController.getSliderValue("Speed")
    
    // Get Joystick data
    let angle = pksController.getJoystickAngle("Movement")
    let power = pksController.getJoystickStrength("Movement")

    // Get a text field's value
    let statusText = pksController.getTextFieldValue("Status")

    serial.writeLine("Speed: " + speed + ", Angle: " + angle)
    basic.pause(100)
})
```

## Example: Send Data to App (Setters)

Push data from the micro:bit back to the app to update the GUI dynamically. The extension automatically handles UART locking and throttling to prevent serial overflow.

```blocks
basic.forever(function () {
    // Send a number (e.g., from a sensor)
    let temp = input.temperature()
    pksController.sendVariableToApp("sensor1", temp)

    // Send a boolean (true/false)
    let isMoving = pksController.getJoystickStrength("Movement") > 0
    pksController.sendBooleanToApp("battery", isMoving)
    
    basic.pause(500)
})
```

## Example: Handle Button Events

Use the Event block to run code exactly when a button is tapped. 

```blocks
// Register code to run when the "Fire" button is pressed in the app
pksController.onButtonPressed("Fire", function () {
    basic.showLeds(`
        . . # . .
        . # # # .
        # # # # #
        . # # # .
        . . # . .
    `)
    music.play(music.builtinPlayableSoundExpression(SoundExpression.Splash))
})
```

## Architecture Notes

All component names are have a strict 15-character limit to prevent Bluetooth buffer overflows.

## License

This project is licensed under the **MIT License**.

## Supported targets

- for PXT/microbit