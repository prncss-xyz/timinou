# Timinou

A minimalist countdown timer for your configurable status bar (such as **Waybar**). Can be used for pomodoro workflow, brewing tea a drawing an art model.

## Setup

1. Install Timinou globally.

2. Configure your status bar.

For Waybar:

`.config/waybar/config`:
```
"modules-left": ["custom/timinou"],

...

"custom/timinou": {
  "exec": "cat /tmp/timinou.txt",
  "interval": 1,
},
```

Waybar refresh at most every second, expect a little lack of synchronization between the status bar and the actual countdown (and the notification).

2. start Timinou.

`> timinou`

## Usage

`> echo >/tmp/timinou.fifo start <command>`

where the command can be:

`start <label>`

Displays label in status bar.

`start <label> <duration>`

Displays label with a countdown in status bar. At termination, the label is removed and a notification is sent.

Duration can be `0s` or `0` for time in seconds, `0m` for time in minutes.

The countdown is displayed up the specified unit, meaning a countdown set in minutes wont display seconds. (This was my initial motivation, as I found a countdown refreshing every second  was in contradiction to the attention management techniques that made me use of a timer in the first place.)

`repeat`

Repeat the last countdown, appending the iteration number to the label.

`reset`

Restart running countdown to initial value.

`pause`

Pause the running countdown.

`resume`

Resume it.

`quit`

Terminate Timinou process.

