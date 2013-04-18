import subprocess
import sys

def check_command_with_output(cmd, print_stdout=False):
  proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
  stdoutdata,stderrdata = proc.communicate()
  if print_stdout:
    sys.stdout.write(stdoutdata)
  sys.stderr.write(stderrdata)
  if proc.returncode != 0:
    raise subprocess.CalledProcessError(proc.returncode, cmd)
  return (stdoutdata,stderrdata)


