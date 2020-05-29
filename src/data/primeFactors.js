const findFactors = (num, factors) => {
	if (num === 1) return [];
	if (num === 2) return [2];
	for (let divisor = 2; divisor <= num / 2; divisor++) {
		const lowerFactors = factors[num / divisor];
		if (lowerFactors) return [divisor, ...lowerFactors];
	}
	return [num];
};
export const primeFactors = (n) =>
	Array(n - 1)
		.fill()
		.reduce(
			(factors, _, index) => {
				const num = index + 2;
				factors[num] = findFactors(num, factors);
				return factors;
			},
			[[], []]
		);

const factors = primeFactors(100);
const primes = factors
	.map((factors, index) => (factors.length === 1 ? index : null))
	.filter((a) => a);

//###################
//  Representations
let minRep;
const multiply = (acc, value) => acc * value;
const toValue = (num) => (num instanceof NumberRep ? num.value : num);
const toString = (num) => (num instanceof NumberRep ? num.string : num);
class NumberRep {
	constructor(factors, plus) {
		this.factors = factors
			? typeof factors === "number"
				? [factors]
				: factors
			: [];
		this.plus = plus || 0;
	}
	get value() {
		const values = this.factors.map(toValue);
		return values.reduce(multiply) + this.plus;
	}
	get string() {
		if (this.value <= minRep) return this.value;
		const factors = this.factors.map(toString).join("x");
		return this.plus ? `(${factors} + ${this.plus})` : factors;
	}
	get fullString() {
		return this.value + ": " + this.string;
	}
}

const findRep = (num, reps, maxPrime) => {
	if (num === 1) return null;
	if (num === 2) return new NumberRep(2);
	for (let divisor = 2; divisor <= num / 2; divisor++) {
		const factorRep = reps[num / divisor];
		if (factorRep) return new NumberRep([reps[divisor], factorRep]);
	}
	const previous = reps[num - 1];
	if (num > maxPrime) return new NumberRep(previous.factors, previous.plus + 1);
	return new NumberRep(num);
};

export const maxComponentsRep = (maxPrime) => (n) =>
	Array(n - 1)
		.fill()
		.reduce(
			(numObjs, _, index) => {
				const num = index + 2;
				numObjs[num] = findRep(num, numObjs, maxPrime);
				return numObjs;
			},
			[[], []]
		);

const reps = maxComponentsRep(200)(1000);
minRep = 2;
reps
	.slice(2, 100)
	.forEach(
		(rep, index) => (index + 2) % 10 === 9 && console.log(rep.fullString)
	);
