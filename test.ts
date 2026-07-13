// tests go here; this will not be compiled when this package is used as a library

function testConfiguration() {
    pksController.setupBluetooth();
    pksController.showDeviceName();

    pksController.waitUntilConnected();

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
}

function testController() {
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

    // Send a number (e.g., from a sensor)
    let temp = input.temperature()
    pksController.sendVariableToApp("sensor1", temp)

    // Send a boolean (true/false)
    let isMoving = pksController.getJoystickStrength("Movement") > 0
    pksController.sendBooleanToApp("battery", isMoving)
    
    basic.pause(500)
}

testConfiguration()
basic.forever(function () {
    testController()
})