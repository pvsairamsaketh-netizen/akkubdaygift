import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  Info,
  Shuffle
} from 'lucide-react';
import { useAcademicsTheme } from '../../../context/AcademicsThemeContext';

export type SortAlgorithm = 
  | 'bubble' 
  | 'selection' 
  | 'insertion' 
  | 'merge' 
  | 'quick' 
  | 'heap' 
  | 'counting' 
  | 'radix' 
  | 'bucket' 
  | 'shell';

export interface SortStep {
  array: number[];
  comparingIndices: [number, number];
  swapped: boolean;
  sortedIndices: number[];
  explanation: string;
  comparisonsCount: number;
  swapsCount: number;
  auxiliaryState?: {
    label: string;
    items: { key: string | number; value: any }[];
  };
}

export const SortingVisualizer: React.FC = () => {
  const { isDark } = useAcademicsTheme();

  const [algorithm, setAlgorithm] = useState<SortAlgorithm>('bubble');
  const [arrayInput, setArrayInput] = useState<string>('5, 2, 8, 1, 3');
  const [currentArray, setCurrentArray] = useState<number[]>([5, 2, 8, 1, 3]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [inputError, setInputError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Bubble Sort
  const generateBubbleSortSteps = (orig: number[]): SortStep[] => {
    const list = [...orig];
    const n = list.length;
    const history: SortStep[] = [];
    const sorted: number[] = [];
    let comps = 0;
    let swaps = 0;

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: [],
      explanation: `Bubble Sort initialized on [${list.join(', ')}]. Repeatedly compares adjacent items and bubbles maximum values to the right.`,
      comparisonsCount: 0,
      swapsCount: 0
    });

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        comps++;
        const needSwap = list[j] > list[j + 1];
        if (needSwap) {
          swaps++;
          const temp = list[j];
          list[j] = list[j + 1];
          list[j + 1] = temp;
        }

        history.push({
          array: [...list],
          comparingIndices: [j, j + 1],
          swapped: needSwap,
          sortedIndices: [...sorted],
          explanation: needSwap
            ? `Comparing indices ${j} & ${j + 1} (${list[j + 1]} > ${list[j]}): Swapped to bubble ${list[j + 1]} rightward.`
            : `Comparing indices ${j} & ${j + 1} (${list[j]} <= ${list[j + 1]}): Already in relative order, no swap.`,
          comparisonsCount: comps,
          swapsCount: swaps
        });
      }
      sorted.push(n - i - 1);
    }
    sorted.push(0);

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: Array.from({ length: n }, (_, k) => k),
      explanation: `Bubble Sort Complete! Sorted: [${list.join(', ')}]. Total Comparisons: ${comps}, Swaps: ${swaps}.`,
      comparisonsCount: comps,
      swapsCount: swaps
    });

    return history;
  };

  // 2. Selection Sort
  const generateSelectionSortSteps = (orig: number[]): SortStep[] => {
    const list = [...orig];
    const n = list.length;
    const history: SortStep[] = [];
    const sorted: number[] = [];
    let comps = 0;
    let swaps = 0;

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: [],
      explanation: `Selection Sort initialized. Partitions array into sorted boundary [0..i] and finds global minimum in remaining subarray.`,
      comparisonsCount: 0,
      swapsCount: 0
    });

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        comps++;
        const isSmaller = list[j] < list[minIdx];
        if (isSmaller) minIdx = j;

        history.push({
          array: [...list],
          comparingIndices: [minIdx, j],
          swapped: false,
          sortedIndices: [...sorted],
          explanation: isSmaller 
            ? `Found new minimum ${list[j]} at index ${j}.`
            : `Comparing candidate min index ${minIdx} (${list[minIdx]}) with index ${j} (${list[j]}).`,
          comparisonsCount: comps,
          swapsCount: swaps
        });
      }

      if (minIdx !== i) {
        swaps++;
        const temp = list[i];
        list[i] = list[minIdx];
        list[minIdx] = temp;

        history.push({
          array: [...list],
          comparingIndices: [i, minIdx],
          swapped: true,
          sortedIndices: [...sorted, i],
          explanation: `Swapped minimum element ${list[i]} into sorted position index ${i}.`,
          comparisonsCount: comps,
          swapsCount: swaps
        });
      }
      sorted.push(i);
    }
    sorted.push(n - 1);

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: Array.from({ length: n }, (_, k) => k),
      explanation: `Selection Sort Complete! Sorted: [${list.join(', ')}]. Always O(N²) comparisons, but at most O(N) swaps.`,
      comparisonsCount: comps,
      swapsCount: swaps
    });

    return history;
  };

  // 3. Insertion Sort
  const generateInsertionSortSteps = (orig: number[]): SortStep[] => {
    const list = [...orig];
    const n = list.length;
    const history: SortStep[] = [];
    const sorted: number[] = [0];
    let comps = 0;
    let shifts = 0;

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: [0],
      explanation: `Insertion Sort initialized. Single element [${list[0]}] at index 0 is trivially sorted. Iterating from index 1.`,
      comparisonsCount: 0,
      swapsCount: 0
    });

    for (let i = 1; i < n; i++) {
      const key = list[i];
      let j = i - 1;

      while (j >= 0) {
        comps++;
        if (list[j] > key) {
          shifts++;
          list[j + 1] = list[j];
          history.push({
            array: [...list],
            comparingIndices: [j, j + 1],
            swapped: true,
            sortedIndices: [...sorted],
            explanation: `Shifted ${list[j + 1]} rightward because it is greater than insertion key ${key}.`,
            comparisonsCount: comps,
            swapsCount: shifts
          });
          j--;
        } else {
          break;
        }
      }
      list[j + 1] = key;
      sorted.push(i);

      history.push({
        array: [...list],
        comparingIndices: [j + 1, j + 1],
        swapped: false,
        sortedIndices: [...sorted],
        explanation: `Inserted key ${key} into position ${j + 1}. Subarray [0..${i}] is now sorted.`,
        comparisonsCount: comps,
        swapsCount: shifts
      });
    }

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: Array.from({ length: n }, (_, k) => k),
      explanation: `Insertion Sort Complete! Sorted: [${list.join(', ')}]. Adaptive: O(N) best case on nearly sorted data!`,
      comparisonsCount: comps,
      swapsCount: shifts
    });

    return history;
  };

  // 4. Merge Sort
  const generateMergeSortSteps = (orig: number[]): SortStep[] => {
    const list = [...orig];
    const history: SortStep[] = [];
    let comps = 0;
    let merges = 0;

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: [],
      explanation: `Merge Sort initialized. Divide-and-conquer strategy: recursively splits array in half, then merges sorted subarrays in O(N log N).`,
      comparisonsCount: 0,
      swapsCount: 0
    });

    const merge = (left: number, mid: number, right: number) => {
      const L = list.slice(left, mid + 1);
      const R = list.slice(mid + 1, right + 1);
      let i = 0, j = 0, k = left;

      while (i < L.length && j < R.length) {
        comps++;
        if (L[i] <= R[j]) {
          list[k] = L[i];
          i++;
        } else {
          list[k] = R[j];
          j++;
        }
        merges++;
        history.push({
          array: [...list],
          comparingIndices: [k, right],
          swapped: true,
          sortedIndices: [],
          explanation: `Merged smaller element ${list[k]} into position ${k} from sorted sublists.`,
          comparisonsCount: comps,
          swapsCount: merges
        });
        k++;
      }

      while (i < L.length) {
        list[k] = L[i];
        i++;
        k++;
        merges++;
      }
      while (j < R.length) {
        list[k] = R[j];
        j++;
        k++;
        merges++;
      }
    };

    const sortSubarray = (left: number, right: number) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        sortSubarray(left, mid);
        sortSubarray(mid + 1, right);
        merge(left, mid, right);
      }
    };

    sortSubarray(0, list.length - 1);

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: Array.from({ length: list.length }, (_, k) => k),
      explanation: `Merge Sort Complete! Sorted: [${list.join(', ')}]. Stable sorting with guaranteed O(N log N) worst-case time, requiring O(N) auxiliary RAM.`,
      comparisonsCount: comps,
      swapsCount: merges
    });

    return history;
  };

  // 5. Quick Sort (Lomuto partition)
  const generateQuickSortSteps = (orig: number[]): SortStep[] => {
    const list = [...orig];
    const history: SortStep[] = [];
    let comps = 0;
    let swaps = 0;

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: [],
      explanation: `Quick Sort initialized. Partitions elements around a pivot. Highly cache-friendly O(N log N) average-case in-place sort.`,
      comparisonsCount: 0,
      swapsCount: 0
    });

    const partition = (low: number, high: number): number => {
      const pivot = list[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        comps++;
        if (list[j] < pivot) {
          i++;
          swaps++;
          const t = list[i];
          list[i] = list[j];
          list[j] = t;

          history.push({
            array: [...list],
            comparingIndices: [i, j],
            swapped: true,
            sortedIndices: [],
            explanation: `Element ${list[i]} < pivot (${pivot}). Swapped to left partition.`,
            comparisonsCount: comps,
            swapsCount: swaps
          });
        }
      }

      swaps++;
      const temp = list[i + 1];
      list[i + 1] = list[high];
      list[high] = temp;

      history.push({
        array: [...list],
        comparingIndices: [i + 1, high],
        swapped: true,
        sortedIndices: [i + 1],
        explanation: `Placed pivot ${pivot} at its permanent sorted position index ${i + 1}.`,
        comparisonsCount: comps,
        swapsCount: swaps
      });

      return i + 1;
    };

    const qsort = (low: number, high: number) => {
      if (low < high) {
        const pi = partition(low, high);
        qsort(low, pi - 1);
        qsort(pi + 1, high);
      }
    };

    qsort(0, list.length - 1);

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: Array.from({ length: list.length }, (_, k) => k),
      explanation: `Quick Sort Complete! Sorted: [${list.join(', ')}]. O(N log N) average time, O(log N) stack space.`,
      comparisonsCount: comps,
      swapsCount: swaps
    });

    return history;
  };

  // 6. Heap Sort
  const generateHeapSortSteps = (orig: number[]): SortStep[] => {
    const list = [...orig];
    const n = list.length;
    const history: SortStep[] = [];
    let comps = 0;
    let swaps = 0;

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: [],
      explanation: `Heap Sort initialized. Builds a Max-Heap where parent >= children, then repeatedly extracts the maximum root element.`,
      comparisonsCount: 0,
      swapsCount: 0
    });

    const heapify = (size: number, rootIdx: number) => {
      let largest = rootIdx;
      const left = 2 * rootIdx + 1;
      const right = 2 * rootIdx + 2;

      if (left < size) {
        comps++;
        if (list[left] > list[largest]) largest = left;
      }
      if (right < size) {
        comps++;
        if (list[right] > list[largest]) largest = right;
      }

      if (largest !== rootIdx) {
        swaps++;
        const temp = list[rootIdx];
        list[rootIdx] = list[largest];
        list[largest] = temp;

        history.push({
          array: [...list],
          comparingIndices: [rootIdx, largest],
          swapped: true,
          sortedIndices: [],
          explanation: `Heapify: Swapped ${list[rootIdx]} to maintain max-heap property at root index ${rootIdx}.`,
          comparisonsCount: comps,
          swapsCount: swaps
        });

        heapify(size, largest);
      }
    };

    // Build heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i);
    }

    // Extract elements
    for (let i = n - 1; i > 0; i--) {
      swaps++;
      const t = list[0];
      list[0] = list[i];
      list[i] = t;

      history.push({
        array: [...list],
        comparingIndices: [0, i],
        swapped: true,
        sortedIndices: [i],
        explanation: `Moved max-heap root (${list[i]}) to end sorted position ${i}.`,
        comparisonsCount: comps,
        swapsCount: swaps
      });

      heapify(i, 0);
    }

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: Array.from({ length: n }, (_, k) => k),
      explanation: `Heap Sort Complete! In-place O(N log N) guaranteed runtime with O(1) auxiliary space.`,
      comparisonsCount: comps,
      swapsCount: swaps
    });

    return history;
  };

  // 7. Counting Sort
  const generateCountingSortSteps = (orig: number[]): SortStep[] => {
    const list = [...orig];
    const history: SortStep[] = [];
    const minVal = Math.min(...list);
    const maxVal = Math.max(...list);
    const range = maxVal - minVal + 1;
    const count = new Array(range).fill(0);

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: [],
      explanation: `Counting Sort: Non-comparison algorithm. Counts frequency of each integer in range [${minVal}..${maxVal}].`,
      comparisonsCount: 0,
      swapsCount: 0,
      auxiliaryState: {
        label: 'Frequency Array (Counts)',
        items: count.map((c, i) => ({ key: minVal + i, value: c }))
      }
    });

    for (let num of list) {
      count[num - minVal]++;
    }

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: [],
      explanation: `Tallied element frequencies: ${count.map((c, i) => `${minVal + i}:${c}`).join(', ')}.`,
      comparisonsCount: 0,
      swapsCount: list.length,
      auxiliaryState: {
        label: 'Frequency Counts',
        items: count.map((c, i) => ({ key: minVal + i, value: c }))
      }
    });

    let idx = 0;
    for (let i = 0; i < range; i++) {
      while (count[i] > 0) {
        list[idx] = i + minVal;
        count[i]--;
        history.push({
          array: [...list],
          comparingIndices: [idx, idx],
          swapped: true,
          sortedIndices: Array.from({ length: idx + 1 }, (_, k) => k),
          explanation: `Placed ${i + minVal} into output array at index ${idx}. Remaining count: ${count[i]}.`,
          comparisonsCount: 0,
          swapsCount: idx + 1,
          auxiliaryState: {
            label: 'Counts Decrementing',
            items: count.map((c, k) => ({ key: minVal + k, value: c }))
          }
        });
        idx++;
      }
    }

    return history;
  };

  // 8. Radix Sort (LSD)
  const generateRadixSortSteps = (orig: number[]): SortStep[] => {
    let list = [...orig];
    const history: SortStep[] = [];
    const maxVal = Math.max(...list);

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: [],
      explanation: `Radix Sort (LSD): Non-comparison sorting using digit-by-digit buckets from Least Significant Digit (1s) to Most Significant Digit.`,
      comparisonsCount: 0,
      swapsCount: 0
    });

    let exp = 1;
    while (Math.floor(maxVal / exp) > 0) {
      const buckets: Record<number, number[]> = {};
      for (let i = 0; i <= 9; i++) buckets[i] = [];

      for (let val of list) {
        const digit = Math.floor(val / exp) % 10;
        buckets[digit].push(val);
      }

      list = [];
      for (let d = 0; d <= 9; d++) {
        for (let num of buckets[d]) {
          list.push(num);
        }
      }

      history.push({
        array: [...list],
        comparingIndices: [-1, -1],
        swapped: true,
        sortedIndices: [],
        explanation: `Sorted by ${exp}'s place digit. Array state: [${list.join(', ')}].`,
        comparisonsCount: 0,
        swapsCount: list.length,
        auxiliaryState: {
          label: `Digit Buckets (${exp}'s place)`,
          items: Object.entries(buckets).filter(([_, arr]) => arr.length > 0).map(([k, arr]) => ({ key: `Digit ${k}`, value: `[${arr.join(', ')}]` }))
        }
      });

      exp *= 10;
    }

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: Array.from({ length: list.length }, (_, k) => k),
      explanation: `Radix Sort Complete! Sorted: [${list.join(', ')}]. O(d * (N + k)) time complexity.`,
      comparisonsCount: 0,
      swapsCount: list.length
    });

    return history;
  };

  // 9. Bucket Sort
  const generateBucketSortSteps = (orig: number[]): SortStep[] => {
    let list = [...orig];
    const history: SortStep[] = [];
    const minVal = Math.min(...list);
    const maxVal = Math.max(...list);
    const bucketCount = 3;
    const buckets: number[][] = [[], [], []];

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: [],
      explanation: `Bucket Sort initialized. Distributes values into 3 partition buckets, sorts buckets individually, and concatenates.`,
      comparisonsCount: 0,
      swapsCount: 0
    });

    const range = (maxVal - minVal + 1) / bucketCount;
    for (let val of list) {
      const bIdx = Math.min(bucketCount - 1, Math.floor((val - minVal) / range));
      buckets[bIdx].push(val);
    }

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: [],
      explanation: `Distributed items into buckets: Bucket 0: [${buckets[0].join(', ')}], Bucket 1: [${buckets[1].join(', ')}], Bucket 2: [${buckets[2].join(', ')}].`,
      comparisonsCount: 0,
      swapsCount: list.length,
      auxiliaryState: {
        label: 'Bucket Partitions',
        items: buckets.map((b, i) => ({ key: `Bucket ${i}`, value: `[${b.join(', ')}]` }))
      }
    });

    list = [];
    for (let b of buckets) {
      b.sort((a, b) => a - b);
      list.push(...b);
    }

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: true,
      sortedIndices: Array.from({ length: list.length }, (_, k) => k),
      explanation: `Sorted each bucket and concatenated! Final sorted array: [${list.join(', ')}].`,
      comparisonsCount: list.length,
      swapsCount: list.length
    });

    return history;
  };

  // 10. Shell Sort
  const generateShellSortSteps = (orig: number[]): SortStep[] => {
    const list = [...orig];
    const n = list.length;
    const history: SortStep[] = [];
    let comps = 0;
    let shifts = 0;

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: [],
      explanation: `Shell Sort: Generalized insertion sort that compares distant elements using diminishing gap sequence (N/2, N/4, ... 1).`,
      comparisonsCount: 0,
      swapsCount: 0
    });

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < n; i++) {
        const temp = list[i];
        let j = i;
        while (j >= gap) {
          comps++;
          if (list[j - gap] > temp) {
            shifts++;
            list[j] = list[j - gap];
            history.push({
              array: [...list],
              comparingIndices: [j - gap, j],
              swapped: true,
              sortedIndices: [],
              explanation: `Gap ${gap}: Shifted ${list[j]} forward because list[${j - gap}] > ${temp}.`,
              comparisonsCount: comps,
              swapsCount: shifts
            });
            j -= gap;
          } else {
            break;
          }
        }
        list[j] = temp;
      }
    }

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: Array.from({ length: n }, (_, k) => k),
      explanation: `Shell Sort Complete! Array fully sorted with gap=1 pass: [${list.join(', ')}].`,
      comparisonsCount: comps,
      swapsCount: shifts
    });

    return history;
  };

  // Recompute steps whenever algorithm or currentArray changes
  useEffect(() => {
    let s: SortStep[] = [];
    if (algorithm === 'bubble') s = generateBubbleSortSteps(currentArray);
    else if (algorithm === 'selection') s = generateSelectionSortSteps(currentArray);
    else if (algorithm === 'insertion') s = generateInsertionSortSteps(currentArray);
    else if (algorithm === 'merge') s = generateMergeSortSteps(currentArray);
    else if (algorithm === 'quick') s = generateQuickSortSteps(currentArray);
    else if (algorithm === 'heap') s = generateHeapSortSteps(currentArray);
    else if (algorithm === 'counting') s = generateCountingSortSteps(currentArray);
    else if (algorithm === 'radix') s = generateRadixSortSteps(currentArray);
    else if (algorithm === 'bucket') s = generateBucketSortSteps(currentArray);
    else s = generateShellSortSteps(currentArray);

    setSteps(s);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [algorithm, currentArray]);

  // Handle Play/Pause timer
  useEffect(() => {
    if (isPlaying) {
      const delay = Math.round(1400 / playbackSpeed);
      timerRef.current = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, delay);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, playbackSpeed]);

  const handleApplyCustomArray = () => {
    try {
      const parsed = arrayInput
        .split(',')
        .map(s => Number(s.trim()))
        .filter(n => !isNaN(n));

      if (parsed.length === 0) {
        setInputError('Please enter at least 1 valid integer.');
        return;
      }
      if (parsed.length > 12) {
        setInputError('Max 12 elements for visual clarity.');
        return;
      }
      setInputError(null);
      setCurrentArray(parsed);
    } catch {
      setInputError('Invalid array format. Use comma-separated numbers (e.g. 5, 2, 8, 1, 3).');
    }
  };

  const handleGenerateRandom = () => {
    const size = 5;
    const rand = Array.from({ length: size }, () => Math.floor(Math.random() * 20) + 1);
    setArrayInput(rand.join(', '));
    setCurrentArray(rand);
    setInputError(null);
  };

  const step = steps[currentStepIndex] || {
    array: currentArray,
    comparingIndices: [-1, -1],
    swapped: false,
    sortedIndices: [],
    explanation: 'Ready.',
    comparisonsCount: 0,
    swapsCount: 0
  };

  const ALGORITHMS_LIST: { id: SortAlgorithm; name: string; tag: string }[] = [
    { id: 'bubble', name: 'Bubble', tag: 'O(N²)' },
    { id: 'selection', name: 'Selection', tag: 'O(N²)' },
    { id: 'insertion', name: 'Insertion', tag: 'O(N²)' },
    { id: 'merge', name: 'Merge', tag: 'O(N log N)' },
    { id: 'quick', name: 'Quick', tag: 'O(N log N)' },
    { id: 'heap', name: 'Heap', tag: 'O(N log N)' },
    { id: 'counting', name: 'Counting', tag: 'O(N+K)' },
    { id: 'radix', name: 'Radix', tag: 'O(d*(N+K))' },
    { id: 'bucket', name: 'Bucket', tag: 'O(N+K)' },
    { id: 'shell', name: 'Shell', tag: 'O(N^1.5)' }
  ];

  return (
    <div className={`p-5 rounded-2xl border transition-all shadow-xl ${
      isDark ? 'bg-[#0b0f17] border-stone-800 text-stone-100' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-stone-800/80 mb-4 gap-3">
        <div>
          <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Interactive Sorting Engine: 10 Standard Algorithms Simulator</span>
          </h4>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
            Deterministic step-by-step state snapshots for comparison and non-comparison algorithms.
          </p>
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 text-xs">
          <input
            type="text"
            value={arrayInput}
            onChange={(e) => setArrayInput(e.target.value)}
            placeholder="e.g. 5, 2, 8, 1, 3"
            className={`px-2.5 py-1 rounded-lg border font-mono text-xs w-36 ${
              isDark ? 'bg-[#141b29] border-stone-700 text-stone-200' : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}
          />
          <button
            onClick={handleApplyCustomArray}
            className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition-colors cursor-pointer"
          >
            Apply
          </button>
          <button
            onClick={handleGenerateRandom}
            className={`p-1 rounded-lg border transition-colors cursor-pointer ${
              isDark ? 'bg-[#141b29] border-stone-700 text-stone-300 hover:bg-[#1a2334]' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
            title="Generate Random Array"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {inputError && (
        <div className="mb-3 text-xs text-rose-400 bg-rose-950/30 p-2 rounded-lg border border-rose-900">
          {inputError}
        </div>
      )}

      {/* Algorithm Tabs (10 algorithms) */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-4 scrollbar-none border-b border-stone-800/60">
        {ALGORITHMS_LIST.map(a => (
          <button
            key={a.id}
            onClick={() => { setAlgorithm(a.id); setIsPlaying(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
              algorithm === a.id
                ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                : isDark ? 'bg-[#121724] border-stone-800 text-stone-400 hover:text-stone-200' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{a.name}</span>
            <span className={`text-[10px] font-mono px-1 rounded ${
              algorithm === a.id ? 'bg-amber-700/80 text-amber-100' : isDark ? 'bg-stone-800 text-stone-500' : 'bg-slate-200 text-slate-600'
            }`}>
              {a.tag}
            </span>
          </button>
        ))}
      </div>

      {/* Counters Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs font-mono">
        <div className={`p-2.5 rounded-xl border text-center ${
          isDark ? 'bg-[#101624] border-stone-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-[10px] text-stone-400 block uppercase">Step Index</span>
          <span className="font-bold text-amber-400 text-sm">{currentStepIndex + 1}/{steps.length}</span>
        </div>
        <div className={`p-2.5 rounded-xl border text-center ${
          isDark ? 'bg-[#101624] border-stone-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-[10px] text-stone-400 block uppercase">Comparisons</span>
          <span className="font-bold text-sky-400 text-sm">{step.comparisonsCount}</span>
        </div>
        <div className={`p-2.5 rounded-xl border text-center ${
          isDark ? 'bg-[#101624] border-stone-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-[10px] text-stone-400 block uppercase">Swaps / Shifts</span>
          <span className="font-bold text-rose-400 text-sm">{step.swapsCount}</span>
        </div>
        <div className={`p-2.5 rounded-xl border text-center ${
          isDark ? 'bg-[#101624] border-stone-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-[10px] text-stone-400 block uppercase">Active Invariant</span>
          <span className="font-bold text-emerald-400 text-xs truncate block">{algorithm.toUpperCase()}</span>
        </div>
      </div>

      {/* Visual Bars Container */}
      <div className={`p-6 rounded-xl border flex flex-col items-center justify-center gap-6 ${
        isDark ? 'bg-[#070a10] border-stone-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-end justify-center gap-3 sm:gap-5 h-48 w-full max-w-lg pt-4 overflow-x-auto">
          {step.array.map((val, idx) => {
            const isComparing = step.comparingIndices.includes(idx);
            const isSorted = step.sortedIndices.includes(idx);
            const maxVal = Math.max(...step.array, 10);
            const heightPx = Math.max(30, Math.round((val / maxVal) * 140) + 20);

            let barBg = '';
            if (isComparing) {
              barBg = step.swapped 
                ? 'bg-rose-500 border-rose-400 shadow-rose-900/50 animate-bounce' 
                : 'bg-amber-500 border-amber-300 shadow-amber-900/50';
            } else if (isSorted) {
              barBg = 'bg-emerald-600 border-emerald-400';
            } else {
              barBg = isDark ? 'bg-sky-700/70 border-sky-600' : 'bg-sky-500 border-sky-400';
            }

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 max-w-[56px] min-w-[28px]">
                <span className="font-mono text-xs font-bold">{val}</span>
                <div 
                  style={{ height: `${heightPx}px` }}
                  className={`w-full rounded-t-xl border transition-all duration-300 flex items-center justify-center shadow-lg ${barBg}`}
                >
                  <span className="text-white text-xs font-extrabold">{val}</span>
                </div>
                <span className={`text-[10px] font-mono ${isDark ? 'text-stone-500' : 'text-slate-500'}`}>
                  [{idx}]
                </span>
              </div>
            );
          })}
        </div>

        {/* Auxiliary State (Buckets / Counts if applicable) */}
        {step.auxiliaryState && (
          <div className="w-full p-3 rounded-xl bg-black/40 border border-stone-800 text-xs font-mono">
            <span className="font-bold text-sky-400 block mb-2">{step.auxiliaryState.label}:</span>
            <div className="flex flex-wrap gap-2">
              {step.auxiliaryState.items.map((item, i) => (
                <div key={i} className="px-2 py-1 rounded bg-[#131b2e] border border-sky-900/50 text-stone-200">
                  <span className="text-amber-400 font-bold">{item.key}:</span> {item.value}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-sky-500 inline-block"></span>
            <span>Unsorted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500 inline-block"></span>
            <span>Evaluating / Compare</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500 inline-block"></span>
            <span>Swap / Shift</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
            <span>Sorted Invariant</span>
          </div>
        </div>

        {/* Step Explanation Banner */}
        <div className={`w-full p-3.5 rounded-xl border flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed ${
          isDark ? 'bg-[#101624] border-stone-800 text-stone-200' : 'bg-white border-slate-300 text-slate-800'
        }`}>
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-amber-400 mr-1.5">Step {currentStepIndex + 1}/{steps.length}:</strong>
            {step.explanation}
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex flex-wrap items-center justify-between w-full gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setCurrentStepIndex(0); setIsPlaying(false); }}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isDark ? 'bg-[#161f30] hover:bg-[#202b42] text-stone-300 border-stone-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => { setCurrentStepIndex(s => Math.max(0, s - 1)); setIsPlaying(false); }}
              disabled={currentStepIndex === 0}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-30 ${
                isDark ? 'bg-[#161f30] hover:bg-[#202b42] text-stone-300 border-stone-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white transition-all cursor-pointer shadow-md"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={() => { setCurrentStepIndex(s => Math.min(steps.length - 1, s + 1)); setIsPlaying(false); }}
              disabled={currentStepIndex === steps.length - 1}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-30 ${
                isDark ? 'bg-[#161f30] hover:bg-[#202b42] text-stone-300 border-stone-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className={`opacity-75 ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>Speed:</span>
            {[0.5, 1, 2].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                  playbackSpeed === speed
                    ? 'bg-amber-600 text-white'
                    : isDark ? 'bg-[#161f30] text-stone-400' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
