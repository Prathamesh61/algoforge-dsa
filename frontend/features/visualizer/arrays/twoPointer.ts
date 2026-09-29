import { AlgorithmStep } from '@/types/visualizer';

export function generateTwoPointerSteps(sortedArray: number[], targetSum: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...sortedArray].sort((a, b) => a - b);
  let left = 0;
  let right = arr.length - 1;
  let stepIndex = 0;

  steps.push({
    stepIndex: stepIndex++,
    type: 'highlight',
    arrayState: [...arr],
    indices: [left, right],
    pointerLabels: { [left]: 'LEFT', [right]: 'RIGHT' },
    highlightType: 'primary',
    message: `Initialized Two-Pointer search for target pair sum = ${targetSum}. Left pointer at 0, Right pointer at ${right}.`,
    pseudoCodeLine: 1,
  });

  while (left < right) {
    const currentSum = arr[left] + arr[right];

    steps.push({
      stepIndex: stepIndex++,
      type: 'compare',
      arrayState: [...arr],
      indices: [left, right],
      pointerLabels: { [left]: 'LEFT', [right]: 'RIGHT' },
      highlightType: 'secondary',
      message: `Comparing sum: arr[${left}] (${arr[left]}) + arr[${right}] (${arr[right]}) = ${currentSum} vs target ${targetSum}.`,
      pseudoCodeLine: 3,
    });

    if (currentSum === targetSum) {
      steps.push({
        stepIndex: stepIndex++,
        type: 'found',
        arrayState: [...arr],
        indices: [left, right],
        pointerLabels: { [left]: 'PAIR 1', [right]: 'PAIR 2' },
        highlightType: 'success',
        message: `Target pair sum found! arr[${left}] (${arr[left]}) + arr[${right}] (${arr[right]}) == ${targetSum}.`,
        pseudoCodeLine: 4,
      });
      return steps;
    } else if (currentSum < targetSum) {
      const nextLeft = left + 1;
      steps.push({
        stepIndex: stepIndex++,
        type: 'modify',
        arrayState: [...arr],
        indices: [left, right],
        pointerLabels: { [left]: 'SUM TOO SMALL' },
        highlightType: 'warning',
        message: `Sum (${currentSum}) < ${targetSum}. Incrementing left pointer to ${nextLeft} to increase sum.`,
        pseudoCodeLine: 6,
      });
      left = nextLeft;
    } else {
      const nextRight = right - 1;
      steps.push({
        stepIndex: stepIndex++,
        type: 'modify',
        arrayState: [...arr],
        indices: [left, right],
        pointerLabels: { [right]: 'SUM TOO LARGE' },
        highlightType: 'warning',
        message: `Sum (${currentSum}) > ${targetSum}. Decrementing right pointer to ${nextRight} to decrease sum.`,
        pseudoCodeLine: 8,
      });
      right = nextRight;
    }
  }

  steps.push({
    stepIndex: stepIndex++,
    type: 'not-found',
    arrayState: [...arr],
    indices: [],
    highlightType: 'danger',
    message: `Pointers met at index ${left}. No pair exists that sums to ${targetSum}.`,
    pseudoCodeLine: 9,
  });

  return steps;
}
