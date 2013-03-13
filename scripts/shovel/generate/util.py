
def write_file(string, path, remove_blank_lines=False):
  """
  Write the given string to the file at path. If remove_blank_lines is True,
  will not write any lines that are empty or contain only whitespace.
  """
  with open(path, 'w') as out:
    for line in string.splitlines():
      is_blank = not line or line.isspace()
      should_write = not remove_blank_lines or not is_blank
      if should_write:
        out.write(line)
        out.write('\n')

