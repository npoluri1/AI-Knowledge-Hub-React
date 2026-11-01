"""pip install matplotlib numpy"""
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-4, 4, 200)
y = np.linspace(-4, 4, 200)
X, Y = np.meshgrid(x, y)
R = np.sqrt(X**2 + Y**2)
Z = np.sinc(R)                                        # sombrero surface

fig = plt.figure(figsize=(11, 5))

ax1 = fig.add_subplot(121, projection="3d")
surf = ax1.plot_surface(X, Y, Z, cmap="viridis", linewidth=0, antialiased=True)
ax1.contour(X, Y, Z, zdir="z", offset=-0.25, cmap="coolwarm")   # floor projection
ax1.set_zlim(-0.25, 1)
ax1.set_title("z = sinc(r)")
fig.colorbar(surf, shrink=0.6)

ax2 = fig.add_subplot(122, projection="3d")
ax2.plot_wireframe(X[::8, ::8], Y[::8, ::8], Z[::8, ::8],
                   color="#7c3aed", linewidth=0.6)
ax2.scatter(0, 0, 1, color="red", s=60)               # peak marker
ax2.set_title("wireframe view")

plt.tight_layout()
plt.savefig("surface.png", dpi=130)
print("saved surface.png")