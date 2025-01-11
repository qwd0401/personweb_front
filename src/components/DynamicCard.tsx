import { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import * as THREE from 'three';

interface TextureParameters {
  fontSize?: number;
  fontFace?: string;
  textColor?: string;
  backgroundColor?: string;
  maxWidth?: number;
}

const DynamicCard = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    // 创建场景
    const scene = new THREE.Scene();

    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      currentContainer.clientWidth / currentContainer.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 14);
    camera.lookAt(0, 0, 0);

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentContainer.clientWidth, currentContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    currentContainer.appendChild(renderer.domElement);

    // 创建半透明球体
    const sphereGeometry = new THREE.SphereGeometry(4.85, 16, 16);
    const sphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x000000) },
        opacity: { value: 0.8 },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float opacity;
        varying vec3 vNormal;
        void main() {
          float alpha = opacity * smoothstep(0.5, 1.0, vNormal.z);
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // 创建小球和标签
    const smallBallGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const smallBalls: THREE.Mesh[] = [];
    const labelSprites: Array<{
      sprite: THREE.Sprite;
      smallBall: THREE.Mesh;
      texture: THREE.Texture;
      needMarquee: boolean;
      labelText: string;
    }> = [];

    const radius = 5;
    const numPoints = 88;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const maxWidth = 160;
    const textSpeed = 0.002;

    // 创建射线投射器
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // 辅助函数
    function createTextTexture(text: string, parameters: TextureParameters = {}) {
      const {
        fontSize = 24,
        fontFace = 'PingFang SC, Microsoft YaHei, Noto Sans, Arial, sans-serif',
        textColor = 'white',
        backgroundColor = 'rgba(0,0,0,0)',
        maxWidth = 160,
      } = parameters;

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      context.font = `${fontSize}px ${fontFace}`;

      const textMetrics = context.measureText(text);
      const textWidth = Math.ceil(textMetrics.width);
      const textHeight = fontSize * 1.2;

      const needMarquee = textWidth > maxWidth;

      let canvasWidth = maxWidth;
      if (needMarquee) {
        canvasWidth = textWidth + 60;
      }

      canvas.width = canvasWidth;
      canvas.height = textHeight;
      context.font = `${fontSize}px ${fontFace}`;
      context.clearRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = textColor;
      context.textAlign = needMarquee ? 'left' : 'center';
      context.textBaseline = 'middle';

      if (needMarquee) {
        context.fillText(text, 0, canvas.height / 2);
      } else {
        context.fillText(text, maxWidth / 2, canvas.height / 2);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

      if (needMarquee) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.repeat.x = maxWidth / canvas.width;
      } else {
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
      }

      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      return { texture, needMarquee, HWRate: textHeight / maxWidth };
    }

    // 生成小球和标签
    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = (2 * Math.PI * i) / goldenRatio;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // 创建小球
      const smallBallMaterial = new THREE.MeshBasicMaterial({
        color: getRandomBrightColor(),
        depthWrite: true,
        depthTest: true,
        side: THREE.FrontSide,
      });

      const smallBall = new THREE.Mesh(smallBallGeometry, smallBallMaterial);
      smallBall.position.set(x * radius, y * radius, z * radius);
      sphere.add(smallBall);
      smallBalls.push(smallBall);

      // 创建标签
      const labelText = getRandomNickname();
      const { texture, needMarquee, HWRate } = createTextTexture(labelText);

      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: true,
        depthTest: true,
        blending: THREE.NormalBlending,
      });

      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(1, HWRate, 1);
      labelSprites.push({ sprite, smallBall, texture, needMarquee, labelText });
      scene.add(sprite);
    }

    // 添加灯光
    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // 定义自动旋转速度和轴（增加速度）
    const autoRotationSpeed = 0.001;
    let autoRotationAxis = new THREE.Vector3(0, 1, 0).normalize();
    let currentAngularVelocity = autoRotationAxis.clone().multiplyScalar(autoRotationSpeed);

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let lastDragDelta = { x: 0, y: 0 };

    // 调整衰减和增长率以保持更快的速度
    const decayRate = 0.95;
    const increaseRate = 1.05;

    // 调整鼠标和触摸的旋转因子
    const mouseRotationFactor = 0.01;
    const touchRotationFactor = 0.004;

    // 鼠标事件处理
    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const onMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;

        lastDragDelta = { x: deltaX, y: deltaY };

        const angleY = deltaX * mouseRotationFactor;
        const angleX = deltaY * mouseRotationFactor;

        const quaternionY = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          angleY
        );
        const quaternionX = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(1, 0, 0),
          angleX
        );

        const deltaQuat = new THREE.Quaternion().multiplyQuaternions(quaternionY, quaternionX);

        sphere.quaternion.multiplyQuaternions(deltaQuat, sphere.quaternion);

        const dragRotationAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize();
        const dragRotationSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * mouseRotationFactor;

        if (dragRotationAxis.length() > 0) {
          currentAngularVelocity.copy(dragRotationAxis).multiplyScalar(dragRotationSpeed);
        }

        previousMousePosition = {
          x: event.clientX,
          y: event.clientY,
        };
      }
    };

    const onMouseUp = () => {
      if (isDragging) {
        isDragging = false;

        const deltaX = lastDragDelta.x;
        const deltaY = lastDragDelta.y;

        if (deltaX !== 0 || deltaY !== 0) {
          const newAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize();
          if (newAxis.length() > 0) {
            autoRotationAxis.copy(newAxis);
          }

          const dragSpeed = currentAngularVelocity.length();
          if (dragSpeed > autoRotationSpeed) {
            // 维持当前旋转速度
          } else {
            currentAngularVelocity.copy(autoRotationAxis).multiplyScalar(autoRotationSpeed);
          }
        }
      }
    };

    // 触摸事件处理
    const onTouchStart = (event: TouchEvent) => {
      event.preventDefault();
      isDragging = true;
      const touch = event.touches[0];
      previousMousePosition = {
        x: touch.clientX,
        y: touch.clientY,
      };
    };

    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      if (isDragging) {
        const touch = event.touches[0];
        const deltaX = touch.clientX - previousMousePosition.x;
        const deltaY = touch.clientY - previousMousePosition.y;

        lastDragDelta = { x: deltaX, y: deltaY };

        const angleY = deltaX * touchRotationFactor;
        const angleX = deltaY * touchRotationFactor;

        const quaternionY = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          angleY
        );
        const quaternionX = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(1, 0, 0),
          angleX
        );

        const deltaQuat = new THREE.Quaternion().multiplyQuaternions(quaternionY, quaternionX);

        sphere.quaternion.multiplyQuaternions(deltaQuat, sphere.quaternion);

        const dragRotationAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize();
        const dragRotationSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * touchRotationFactor;

        if (dragRotationAxis.length() > 0) {
          currentAngularVelocity.copy(dragRotationAxis).multiplyScalar(dragRotationSpeed);
        }

        previousMousePosition = {
          x: touch.clientX,
          y: touch.clientY,
        };
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (isDragging) {
        isDragging = false;

        const deltaX = lastDragDelta.x;
        const deltaY = lastDragDelta.y;

        if (deltaX !== 0 || deltaY !== 0) {
          const newAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize();
          if (newAxis.length() > 0) {
            autoRotationAxis.copy(newAxis);
          }

          const dragSpeed = currentAngularVelocity.length();
          if (dragSpeed > autoRotationSpeed) {
            // 维持当前旋转速度
          } else {
            currentAngularVelocity.copy(autoRotationAxis).multiplyScalar(autoRotationSpeed);
          }
        }

        // 检查点击事件
        if (event.changedTouches.length > 0) {
          const touch = event.changedTouches[0];
          const rect = currentContainer.getBoundingClientRect();
          if (rect) {
            mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(smallBalls, false);

            if (intersects.length > 0) {
              const intersectedBall = intersects[0].object as THREE.Mesh;
              const index = smallBalls.findIndex(ball => ball.uuid === intersectedBall.uuid);
              if (index !== -1) {
                const labelInfo = labelSprites[index];
                alert(`点击的小球标签：${labelInfo.labelText}`);
              }
            }
          }
        }
      }
    };

    // 阻止默认手势
    const onGestureStart = (event: Event) => {
      event.preventDefault();
    };

    // 添加点击事件处理函数
    const onClick = (event: MouseEvent) => {
      const rect = currentContainer.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(smallBalls, false);

      if (intersects.length > 0) {
        const intersectedBall = intersects[0].object as THREE.Mesh;
        const index = smallBalls.findIndex(ball => ball.uuid === intersectedBall.uuid);
        if (index !== -1) {
          const labelInfo = labelSprites[index];
          alert(`点击的小球标签：${labelInfo.labelText}`);
        }
      }
    };

    // 添加事件监听器
    currentContainer.addEventListener('mousedown', onMouseDown);
    currentContainer.addEventListener('mousemove', onMouseMove);
    currentContainer.addEventListener('click', onClick);
    currentContainer.addEventListener('touchstart', onTouchStart);
    currentContainer.addEventListener('touchmove', onTouchMove);
    currentContainer.addEventListener('touchend', onTouchEnd);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('gesturestart', onGestureStart);

    // 修改动画循环
    function animate() {
      requestAnimationFrame(animate);

      if (!isDragging) {
        const deltaQuat = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            currentAngularVelocity.x,
            currentAngularVelocity.y,
            currentAngularVelocity.z,
            'XYZ'
          )
        );
        sphere.quaternion.multiplyQuaternions(deltaQuat, sphere.quaternion);

        const currentSpeed = currentAngularVelocity.length();

        if (currentSpeed > autoRotationSpeed) {
          currentAngularVelocity.multiplyScalar(decayRate);
          if (currentAngularVelocity.length() < autoRotationSpeed) {
            currentAngularVelocity.copy(autoRotationAxis).multiplyScalar(autoRotationSpeed);
          }
        } else if (currentSpeed < autoRotationSpeed) {
          currentAngularVelocity.multiplyScalar(increaseRate);
          if (currentAngularVelocity.length() > autoRotationSpeed) {
            currentAngularVelocity.copy(autoRotationAxis).multiplyScalar(autoRotationSpeed);
          }
        }
      }

      // 更新标签位置
      labelSprites.forEach(({ sprite, smallBall, texture, needMarquee }) => {
        smallBall.updateMatrixWorld();
        const smallBallWorldPos = new THREE.Vector3();
        smallBall.getWorldPosition(smallBallWorldPos);

        const upOffset = new THREE.Vector3(0, 0.3, 0);
        sprite.position.copy(smallBallWorldPos).add(upOffset);

        if (needMarquee) {
          texture.offset.x += textSpeed;
          if (texture.offset.x > 1) {
            texture.offset.x = 0;
          }
        }
      });

      renderer.render(scene, camera);
    }

    animate();

    // 修改清理函数
    return () => {
      // 移除所有事件监听器
      currentContainer.removeEventListener('mousedown', onMouseDown);
      currentContainer.removeEventListener('mousemove', onMouseMove);
      currentContainer.removeEventListener('click', onClick);
      currentContainer.removeEventListener('touchstart', onTouchStart);
      currentContainer.removeEventListener('touchmove', onTouchMove);
      currentContainer.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('gesturestart', onGestureStart);

      // 移除渲染器
      currentContainer.removeChild(renderer.domElement);

      // 清理资源
      renderer.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      smallBallGeometry.dispose();
      smallBalls.forEach(ball => {
        ball.geometry.dispose();
        (ball.material as THREE.Material).dispose();
      });
      labelSprites.forEach(({ sprite, texture }) => {
        (sprite.material as THREE.Material).dispose();
        texture.dispose();
      });
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: { xs: 300, md: 400, lg: 500 },
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        background: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.5)'
            : '0 8px 32px rgba(0, 0, 0, 0.3)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 4px)',
          backgroundSize: '50px 50px',
          animation: 'twinkle 4s infinite',
          opacity: 0.2,
        },
        '@keyframes twinkle': {
          '0%, 100%': {
            opacity: 0.2,
          },
          '50%': {
            opacity: 0.3,
          }
        }
      }}
    />
  );
};

// 辅助函数
function getRandomBrightColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 40 + 10);
  const lightness = Math.floor(Math.random() * 40 + 40);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function getRandomNickname() {
  const adjectives = ['敏捷', '创新', '专业', '高效', '严谨', '灵活', '资深', '全能', '精益', '远见'];
  const nouns = ['产品官', 'PM', '需求师', '设计家', '迭代官', '规划师', '决策者', '引路人', '布道者', '领航员'];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdjective}${randomNoun}`;
}

export default DynamicCard; 