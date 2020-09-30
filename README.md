# Demo Machine Integration

This Project is a very trivial but a common use-case in factories.

You have a number of machines with already existing PLC programs installed, a more or less well documented API and the requirement to show the state of the machines on a dashboard. Last but not lest the current task should be traced as well.

## The Setup looks like that

```text
                     Dashboard
                 ___________________________
                |             |             |
                |  Machines   |  Tasks      |
                | 1 idle      | 1 active    |
                | 2 active    | 2 idle      |
                | ...         | 3 ...       |
                |             |             |
                |_____________|_____________|


  Machine                                     Task-System
   _________________________                 __________________________
  |                         |               |                          |
  |  On     Tasks     More  |               |  Name     _____________  |
  |   o       o        o    |               |  Duration |5|10|20| sec  |
  |                         |               |  Machine  |M1|M2|...|    |
  | on/off  Start    Error  |               |                          |
  |   o       o        O    |               |           |Place Task|   |
  |_________________________|               |__________________________|


                  smartphone
                 _____________
                |             |
                |  Machines   |
                | 1 idle      |
                | 2 active    |
                | ...         |
                |_____________|
                |             |
                |  Tasks      |
                | 1 active    |
                | 2 idle      |
                | 3 ...       |
                |_____________|

```

TODO: continue here
