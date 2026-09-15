# 05.11 — Linked Lists as Stacks, Queues & Deques

## Stack
A stack is LIFO. Using the head as the top gives O(1) push and pop. Using a singly-linked tail as the top makes pop O(N).

## Queue
A queue is FIFO. Maintain both head and tail:

```text
HEAD → A → B → C ← TAIL
```

Enqueue at tail and dequeue at head: O(1) each. Reset both pointers when the final node is removed.

## Deque
A deque supports insertion and removal at both ends. A doubly linked list with head and tail gives O(1) pushFront, pushBack, popFront, and popBack.

## Sentinel Design
Dummy/sentinel nodes reduce boundary special cases and make empty transitions easier to reason about.

## Important Engineering Concerns
- Define underflow behavior.
- Define capacity and overflow behavior.
- Consider backpressure for backend queues.
- Preserve head, tail, and size invariants.
- Do not expose mutable internal nodes accidentally.
- Sequential correctness is different from concurrency safety.

## Complexity

| ADT | Operation | Complexity |
|---|---|---:|
| Stack | push/pop | O(1) |
| Queue | enqueue/dequeue with head+tail | O(1) |
| Deque | all end operations with doubly list | O(1) |

## LRU Connection
A classic LRU design combines a map for expected O(1) lookup with a doubly linked list for O(1) detach and move operations.

## Backend Applications
Request queues, worker queues, retry queues, batching, scheduling, cache eviction, and producer/consumer pipelines.

## AI Applications
BFS, candidate processing, inference queues, beam-search management, bounded task scheduling, and streaming preprocessing.

## Choosing the Structure
For pure stacks and many queues, arrays or ring buffers can outperform linked structures because of memory locality and lower allocation overhead. Priority queues generally call for heaps or other ordered structures.

## Revision Checklist
- [ ] Implement a linked-list stack.
- [ ] Implement a queue with head and tail.
- [ ] Implement a doubly linked deque.
- [ ] Explain why tail metadata makes enqueue O(1).
- [ ] Handle empty and singleton transitions.
- [ ] Define underflow and capacity behavior.
- [ ] Explain backpressure.
- [ ] Distinguish FIFO, LIFO, deque, and priority queue.
- [ ] Explain map + doubly linked list LRU.
- [ ] Compare linked structures with arrays and ring buffers.
