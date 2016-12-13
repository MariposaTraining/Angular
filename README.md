# Mariposa Public Site

- Starting the server: `unicorn -c config/unicorn.rb -D`
- Stopping the server:
 1. `cat shared/pids/unicorn.pid`
 2. Copy the printed PID
 3. `kill -2 <PID>`