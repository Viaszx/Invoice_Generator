# Monitoring Hybrid Battery on Mazda CX-30 
***
This is a simple example of how you can use diagnostic requests, which do not require an authentication, to get the information you need. 
This project displays information about the voltage of each individual cell, as well as the state of charge and battery voltage.

The device is connected to the OBD2 diagnostic connector on the Mazda CX-30 e-Skyactiv-X.

**Development Environment:**
- CooCox CoIDE Version: 1.7.7

# Example for BCM (Body Control Module)
***
| ID  | B0 | B1 | B2 | B3 | B4 | B5 | B6 | B7 | Description             |
| --  | -- | -- | -- | -- | -- | -- | -- | -- | --                      |
| 726 | 03 | 22 | C2 | 5B | 00 | 00 | 00 | 00 | Requesting the number of keys |
| 72E | 04 | 62 | C2 | 5B | 02 | 00 | 00 | 00 | Key number response |

## Overview

This example demonstrates a diagnostic command following the UDS standard, commonly used in automotive diagnostics. The communication involves a request (ID 726) and a corresponding response (ID 72E).

## Request (0x726) - BCM

- **Length:** 03 bytes (following the control byte).
- **SID (Service Identifier):** 22 - Indicates a request for reading data.
- **DID (Data Identifier):** C2 5B - Identifies the data to be read (in this case, C25B).
- **Optional Data:** 00 00 00 00 - Additional request data (in this example, no extra data).

## Response (0x72E) - BCM

- **Length:** 04 bytes.
- **Positive Response SID:** 62 - Indicates a successful execution of the request.
- **DID (Data Identifier):** C2 5B - Same data identifier as in the request.
- **Data:** 02 - Represents the response data (in this case, the number of stored keys).
## Hardware Components
----------------------
| Component                                  | Name                              |
|--------------------------------------------|-----------------------------------|
| Microcontroller                            | [STM32F103C8T6][stm32-url]        |
| Display                                    | [SSD1306 I2C 128x64][oled-url]    |
| CAN Transceiver                            | [MCP2551-I/SN][can-url]           |
| Step-Down Voltage Regulator*               | [D24V50F5][pololu-V50-url]        |
| Resistor                                   | R1: 10 kΩ                         |

**Note:**
The step-Down Voltage Regulator [D24V50F5][pololu-V50-url] regulator is a relatively expensive option but offers comprehensive protection features. 
For a more cost-effective solution, consider the [S13V10F5][pololu-V10-url]. 
The [S13V30F5][pololu-V30-url] is an advanced version with reverse voltage protection up to 20V.

## Schematics
-------------
![Mazda_CX-30_e-Skyactiv-X_Hybrid](https://github.com/Viaszx/Mazda-SkyActiv-EngineCoolantTemp/assets/78595419/8b29be33-ed9b-4fe7-a159-91a67750705e)

## Pinout
---------
| STM32F103C8T6 | SSD1306       | MCP2551 | Resistor | Voltage Regulator | OBD2 |
|---------------|---------------|---------|----------|-------------------|------|
| 5V            |               | VDD     |          | VOUT              |      |
| 3.3V          | VCC           |         |          |                   |      |
| GND           | GND           | VSS     | R1       | GND               | 4-5  |
| B6            | SLC           |         |          |                   |      |
| B7            | SDA           |         |          |                   |      |
| B11           |               | RXD     |          |                   |      |
| B12           |               | TXD     |          |                   |      |
|               |               | RS      | R1       |                   |      |
|               |               | CANH    |          |                   | 6    |
|               |               | CANL    |          |                   | 14   |
|               |               |         |          | VIN               | 16   |

## SSD1306 Display Driver
***
The SSD1306 display driver files used in this project were originally authored by [Tilen Majerle](tilen@majerle.eu). 
[Alexander Lutsai](s.lyra@ya.ru) has made modifications specifically for STM32f10x.

#### License Information

The SSD1306 display driver files are distributed under the terms of the GNU General Public License as published by the Free Software Foundation. The full text of the license can be found [here](http://www.gnu.org/licenses/).

## Visual
---------
![Mazda-CX30_320](https://github.com/Viaszx/Mazda-SkyActiv-EngineCoolantTemp/assets/78595419/bdcf30fb-96f4-4256-b035-66f812dc6ddc)



   [stm32-url]: <https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html>
   [oled-url]: <https://www.solomon-systech.com/product/ssd1306/>
   [can-url]: <https://ww1.microchip.com/downloads/en/devicedoc/20001667g.pdf>
   [pololu-V50-url]: <https://www.pololu.com/product/2851>
   [pololu-v10-url]: <https://www.pololu.com/product/4083>
   [pololu-v30-url]: <https://www.pololu.com/product/4082>
