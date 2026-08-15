export type Project = {
  name: string;
  blurbEn: string;
  blurbZh: string;
  tags: string[];
  github: string;
  demo?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    name: 'UniMPI',
    blurbEn:
      'C99 runtime-dispatch layer for MPI. Link once, then load Open MPI, MPICH, Intel MPI, or MS-MPI at runtime.',
    blurbZh: 'C99 MPI 运行时分发层。应用只链一次，运行时再加载 Open MPI / MPICH / Intel MPI / MS-MPI。',
    tags: ['C', 'MPI', 'HPC'],
    github: 'https://github.com/UniMPI/UniMPI',
    featured: true,
  },
  {
    name: 'particle-forge-web',
    blurbEn:
      'Local-first browser viewer for particle-simulation CSV frames. Parses attributes in-browser and renders an interactive Three.js point cloud.',
    blurbZh: '本地优先的粒子仿真 CSV 浏览器查看器。在浏览器解析场量，用 Three.js 点云交互查看。',
    tags: ['TypeScript', 'Three.js', 'SPH'],
    github: 'https://github.com/joe-cheung-cae/particle-forge-web',
    featured: true,
  },
  {
    name: 'muparserx-wrapper',
    blurbEn:
      'C++17 JSON-defined expression runtime on muparserx. Constants, tables, and expressions behind a clean solver-facing API.',
    blurbZh: '基于 muparserx 的 C++17 JSON 表达式运行时。常量、表格插值与表达式统一给求解器调用。',
    tags: ['C++17', 'CMake', 'Solvers'],
    github: 'https://github.com/joe-cheung-cae/muparserx-wrapper',
    featured: true,
  },
  {
    name: 'gpu-devops',
    blurbEn:
      'CUDA builder images and offline GPU toolchain exchange for source builds of MPI, HDF5, NCCL, and related HPC deps.',
    blurbZh: 'CUDA 构建镜像与离线 GPU 工具链，用于源码编译 MPI、HDF5、NCCL 等 HPC 依赖。',
    tags: ['CUDA', 'Docker', 'DevOps'],
    github: 'https://github.com/joe-cheung-cae/gpu-devops',
    featured: true,
  },
  {
    name: 'point3d-interp',
    blurbEn: '3D scattered-point interpolation utilities for CAE field mapping.',
    blurbZh: '面向 CAE 场映射的三维散点插值工具。',
    tags: ['C++', 'Geometry'],
    github: 'https://github.com/joe-cheung-cae/point3d-interp',
  },
  {
    name: 'material-gpu',
    blurbEn: 'GPU-side material model experiments for particle and continuum solvers.',
    blurbZh: '粒子 / 连续体求解器的 GPU 本构模型试验代码。',
    tags: ['C++', 'CUDA', 'Materials'],
    github: 'https://github.com/joe-cheung-cae/material-gpu',
  },
  {
    name: 'memory-pool',
    blurbEn: 'C++ memory pool for high-frequency solver allocations.',
    blurbZh: '面向求解器高频分配的 C++ 内存池。',
    tags: ['C++', 'Performance'],
    github: 'https://github.com/joe-cheung-cae/memory-pool',
  },
  {
    name: 'cli-parser',
    blurbEn: 'Small C++ CLI parser used across internal solver tools.',
    blurbZh: '内部求解器工具共用的轻量 C++ 命令行解析器。',
    tags: ['C++', 'Tools'],
    github: 'https://github.com/joe-cheung-cae/cli-parser',
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
