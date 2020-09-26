import { Tag, Fish, FishId } from '@actyx/pond'
/**
 * Task Fish.
 * Very minimal integration to represent the state of a task with a given name or get a list of all open tasks
 *
 * Events: PlacedEvent, StartedEvent, FinishedEvent
 * Tags: task
 * Fish: TaskFish.of('name'), TaskFish.registry
 */

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !
// ! all undocumented parts are documented in the machineFish.ts
// !
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// ----------------------------------------------------------------------
// |                                                                    |
// | State Section                                                      |
// |                                                                    |
// ----------------------------------------------------------------------

export type UndefineState = {
  stateType: 'undefined'
}
/**
 * complete lifecycle of the Task in one type definition with differed stateTypes
 */
export type DefinedState = {
  stateType: 'idle' | 'active' | 'done'
  name: string
  duration: number
  machine: string
}

export type State = UndefineState | DefinedState

export type RegState = Record<string, boolean>

// ----------------------------------------------------------------------
// |                                                                    |
// | Event Section                                                      |
// |                                                                    |
// ----------------------------------------------------------------------
// !
// ! see importend note about events in the machineFish.ts file
// !

/**
 * Event when a new order/Task is placed on the shop-floor
 */
export type PlacedEvent = {
  eventType: 'placed'
  name: string
  duration: number
  machine: string
}
/**
 * Event, when a machine start the work on this order/task
 */
export type StartedEvent = {
  eventType: 'started'
  name: string
  machine: string
}
/**
 * Event, when a machine finished the order/task
 */
export type FinishedEvent = {
  eventType: 'finished'
  name: string
}

/**
 * union type All expected events the MachineFish will get from the store
 */
export type Event = PlacedEvent | StartedEvent | FinishedEvent

// ----------------------------------------------------------------------
// |                                                                    |
// | Tags Section                                                       |
// |                                                                    |
// ----------------------------------------------------------------------
const tags = {
  /**
   * All task events should be emit with this tag. with the task name `task.withId(name)`
   */
  task: Tag<Event>('task'),
  /**
   * tag for witch machine this task is generated
   */
  taskForMachine: Tag<Event>('task-for-machine'),
}

// ----------------------------------------------------------------------
// |                                                                    |
// | Fish Section                                                       |
// |                                                                    |
// ----------------------------------------------------------------------

/**
 * Function to reduce the task events to the map, describing the map of
 * existing tasks
 *
 * Nearly the same as the MachineFish.registry
 * but this registry deletes the task as soon a finish event occurs
 *
 * @param state current known task name
 * @param event ne incoming task event
 */
const registryOnEvent = (state: RegState, event: Event): RegState => {
  switch (event.eventType) {
    case 'placed':
      state[event.name] = true
      return state
    case 'finished':
      delete state[event.name]
      return state
    default:
      break
  }
  return state
}

/**
 * Define the TaskFish as a exported collection of factory functions and
 * the tags. This will provide you a cleaner interface on the import site.
 *
 * eg
 * ```typescript
 * import { TaskFish } from '../fish/taskFish'
 *
 * pond.observe(TaskFish.of('Task#1'), console.log)
 * pond.emit(TaskFish.tags.task.withId('Task#1'), examplePlaceEvent)
 * ```
 */
export const TaskFish = {
  /** defined tags from above */
  tags,
  /** factory to create a fish that represent one specific task name */
  of: (name: string): Fish<State, Event> => ({
    /** @see MachineFish */
    fishId: FishId.of('taskFish', name, 0),
    /** @see MachineFish */
    initialState: { stateType: 'undefined' },
    /** @see MachineFish */
    where: tags.task.withId(name),
    /**
     * The onEvent function reduce all incoming events to the state of
     * the task.
     *
     * in case of an placed event, the task is set or reset to the data
     * from the event, and use the name from the factory to set the name
     *
     * the start and stop is only valid if the state machine is valid to
     * transmision to the next stage. The old state transferred to the
     * new state, but the stateType gets updated.
     */
    onEvent: (state, event) => {
      switch (event.eventType) {
        case 'placed':
          return {
            stateType: 'idle',
            name,
            duration: event.duration,
            machine: event.machine,
          }
        case 'started':
          if (state.stateType === 'idle') {
            return {
              ...state,
              stateType: 'active',
            }
          }
          return state
        case 'finished':
          if (state.stateType === 'active') {
            return {
              ...state,
              stateType: 'done',
            }
          }
          return state

        default:
          break
      }
      return state
    },
    isReset: (event) => event.eventType === 'placed',
  }),
  /**
   * registry of all available tasks
   * :note: Registry fish should only keep a list of the entities. They are more flexible to use
   */
  registry: {
    fishId: FishId.of('taskRegistry', 'reg', 0),
    initialState: {},
    where: tags.task,
    onEvent: registryOnEvent,
  } as Fish<RegState, Event>,
  /**
   * Copy of the registry fish but contains a filter for the machine
   *
   * a better solution would be
   */
  availableTasksFor: (machineName: string): Fish<RegState, Event> => ({
    fishId: FishId.of('taskRegistryForMachine', 'reg', 0),
    initialState: {},
    where: tags.taskForMachine.withId(machineName),
    onEvent: registryOnEvent,
  }),
}
