// Cloud/Network Animation for DG Portfolio
// Creates animated infrastructure nodes with connections

class CloudAnimation {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.nodes = [];
        this.animationFrameId = null;
        this.time = 0;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        this.init();
    }

    init() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '1';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.opacity = '0.6';
        this.canvas.style.mixBlendMode = 'screen';
        
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.resizeCanvas();
        
        // Create nodes
        this.createNodes();
        
        // Event listeners
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Start animation
        this.animate();
    }

    resizeCanvas() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    createNodes() {
        this.nodes = [];
        const nodeCount = 25;
        const types = ['server', 'container', 'cloud', 'database'];
        
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 15 + 8,
                type: types[Math.floor(Math.random() * types.length)],
                opacity: Math.random() * 0.3 + 0.15,
                angle: Math.random() * Math.PI * 2,
            });
        }
    }

    getNodeColor(type) {
        const isDark = document.documentElement.classList.contains('dark') || 
                       document.body.classList.contains('dark');
        
        const colors = {
            server: isDark ? '#6366f1' : '#4f46e5',      // indigo
            container: isDark ? '#a78bfa' : '#7c3aed',   // purple
            cloud: isDark ? '#818cf8' : '#6366f1',       // indigo-light
            database: isDark ? '#ec4899' : '#be185d'     // pink
        };
        
        return colors[type] || colors.server;
    }

    drawNode(node) {
        this.ctx.save();
        this.ctx.globalAlpha = node.opacity;
        const color = this.getNodeColor(node.type);
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 1.5;

        switch (node.type) {
            case 'server':
                this.ctx.fillRect(node.x - node.size / 2, node.y - node.size / 2, node.size, node.size);
                this.ctx.strokeRect(node.x - node.size / 2, node.y - node.size / 2, node.size, node.size);
                break;
            case 'container':
                this.drawHexagon(node.x, node.y, node.size / 2);
                break;
            case 'cloud':
                this.drawCloud(node.x, node.y, node.size);
                break;
            case 'database':
                this.drawDatabase(node.x, node.y, node.size);
                break;
        }
        this.ctx.restore();
    }

    drawHexagon(x, y, size) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            if (i === 0) this.ctx.moveTo(px, py);
            else this.ctx.lineTo(px, py);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawCloud(x, y, size) {
        this.ctx.beginPath();
        this.ctx.arc(x - size / 3, y, size / 3, 0, Math.PI * 2);
        this.ctx.arc(x, y - size / 4, size / 2.5, 0, Math.PI * 2);
        this.ctx.arc(x + size / 3, y, size / 3, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawDatabase(x, y, size) {
        const width = size;
        const height = size * 1.2;
        const ellipseHeight = size / 4;

        this.ctx.beginPath();
        this.ctx.ellipse(x, y - height / 2, width / 2, ellipseHeight, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillRect(x - width / 2, y - height / 2, width, height);
        this.ctx.strokeRect(x - width / 2, y - height / 2, width, height);

        this.ctx.beginPath();
        this.ctx.ellipse(x, y + height / 2, width / 2, ellipseHeight, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawConnections() {
        const isDark = document.documentElement.classList.contains('dark') || 
                       document.body.classList.contains('dark');
        
        this.ctx.strokeStyle = isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(79, 70, 229, 0.15)';
        this.ctx.lineWidth = 1.5;

        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 280) {
                    const opacity = (1 - distance / 280) * 0.4;
                    this.ctx.globalAlpha = opacity;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                    this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                    this.ctx.stroke();
                }
            }
        }
        this.ctx.globalAlpha = 1;
    }

    animate = () => {
        this.time++;
        
        // Semi-transparent clear for trail effect
        this.ctx.globalAlpha = 0.08;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.globalAlpha = 1;

        // Update and draw nodes
        this.nodes.forEach((node, index) => {
            node.x += node.vx;
            node.y += node.vy;
            node.angle += 0.002;
            
            // Add wave motion
            const waveInfluence = Math.sin(this.time * 0.001 + node.angle) * 0.25;
            node.vy += waveInfluence * 0.0015;

            // Wrap around edges
            if (node.x < -50) node.x = this.width + 50;
            if (node.x > this.width + 50) node.x = -50;
            if (node.y < -50) node.y = this.height + 50;
            if (node.y > this.height + 50) node.y = -50;

            // Gentle damping
            node.vx *= 0.998;
            node.vy *= 0.998;

            this.drawNode(node);
        });

        this.drawConnections();
        this.animationFrameId = requestAnimationFrame(this.animate);
    }

    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize cloud animation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CloudAnimation();
});
