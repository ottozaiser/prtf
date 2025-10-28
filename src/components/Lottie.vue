<template>
	<div :style="style" ref="lavContainer"></div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
	props: {
		options: {
			type: Object,
			required: true,
		},
	},
	setup(props, { emit }) {
		const lavContainer = ref(null);
		const style = {
			overflow: "hidden",
			margin: "0 auto",
		};

		let anim;

		// Load lottie from a CDN at runtime to avoid bundling it.
		const LOTTIE_CDN = 'https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie.min.js';

		function loadScript(src) {
			return new Promise((resolve, reject) => {
				if (typeof window === 'undefined') return reject(new Error('No window object'));
				const existing = document.querySelector(`script[src="${src}"]`);
				if (existing) {
					if (existing.loaded) return resolve(existing);
					existing.addEventListener('load', () => resolve(existing));
					existing.addEventListener('error', () => reject(new Error('Failed to load script')));
					return;
				}
				const s = document.createElement('script');
				s.src = src;
				s.async = true;
				s.onload = () => { s.loaded = true; resolve(s); };
				s.onerror = () => reject(new Error('Failed to load script'));
				document.head.appendChild(s);
			});
		}

		onMounted(async () => {
			try {
				if (typeof window === 'undefined') return;
				if (!window.lottie) {
					await loadScript(LOTTIE_CDN);
				}
				const lottie = window.lottie;
				if (!lottie || !lottie.loadAnimation) throw new Error('lottie not available');
				anim = lottie.loadAnimation({
					container: lavContainer.value,
					renderer: 'svg',
					loop: props.options.loop !== false,
					autoplay: props.options.autoplay !== false,
					animationData: props.options.animationData,
					rendererSettings: props.options.rendererSettings,
				});
				emit('animCreated', anim);
			} catch (err) {
				console.warn('Lottie player failed to load from CDN, animation skipped', err);
			}
		});

		onUnmounted(() => {
			if (anim && typeof anim.destroy === 'function') {
				anim.destroy();
			}
		});

		return {
			style,
			lavContainer,
		};
	},
};
</script>
