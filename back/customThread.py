import threading

class CustomThread(threading.Thread):
  def __init__(self, target, *args, **kwargs):
    super().__init__()
    self.target = target
    self.args = args
    self.kwargs = kwargs
    self.result = None

  def run(self):
    self.result = self.target(*self.args, **self.kwargs)



def create_threads(names, funcs, args=None, vals=None):
  threads = {}
  for i, name in enumerate(names):
    if args and vals and args[i]:
      thread = CustomThread(target=funcs[i], args=vals[i])
    else:
      thread = CustomThread(target=funcs[i])
    threads[name] = thread
  
  for name in threads:
    threads[name].start()
  
  for name in threads:
    threads[name].join()
  
  results = {}
  for name in threads:
    if hasattr(threads[name], 'result'):
      value = threads[name].result
      results[name] = value
    else:
      results[name] = None

  return results
